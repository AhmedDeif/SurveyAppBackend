/* *
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt-nodejs')
var moment = require('moment')
var util = require('util');
var _ = require('underscore')

function updateUserPassword (password, user_id, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, null, function (err, hash) {
      User.update({id: user_id}, {password: hash}).exec(function (err, users) {
        if (err || users.length == 0) {
          Reporting.logError(err, __filename, req.user)
          callback(err, null)
        } else {
          Analytics.track('server:user edited profile', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
          })
          callback(null, users[0])
          //  res.json(users[0].toJSON())
        }
      })
    })
  })
}

function compareMobileCode (req, res, code, savedCode, phone) {
  if (code == savedCode) {
    if(!req.user)
      return res.ok({msg: 'Mobile Verified Successfully'})
    User.update({id: req.user.id}, {phone: phone}).exec(function (err, users) {
      if (err) return res.badRequest('This mobile number already exists and used by another user!')
      if (users.length == 0) {
        Reporting.logError(err, __filename, req.user)
        return res.badRequest("Error saving your mobile number, please try again.")
      }
      else {
        Analytics.track('server:user verified mobile', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
        })
        UserService.updateUserInfoCookie(res, users[0])
        res.ok(users[0].toJSON())
      }
    })
  } else {
    console.log("No Match")
    return res.badRequest("Mobile verification code entered does not match")
  }
}

module.exports = {

  /* *
   * User logout
   *
   * (GET /user/logout/)
   */
  logout: function (req, res) {
    res.clearCookie('e_m_t')
    UserService.deleteUserInfoCookie(res)
    req.session.user = undefined
    req.session.authenticated = false
    req.logout()
    res.json({})
  },

  /* *
   * View user account page
   *
   * (GET /user/account/)
   */
  account: function(req, res){
    res.ok({title: 'Account Settings'}, 'user/account/account')
  },

  /* *
   * Update user account info
   *
   * (POST /user/updateProfileinfo/)
   */
  updateProfileinfo: function (req, res) {
    var usr = req.param("user")
    // console.log(usr)

    if(usr.work_email == '')
        usr.work_email = null;

    if (!usr.updated_location)
      usr.updated_location = true

    var toCompareEmail = usr.email

    UserService.getCurrUserInfo(req, function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      toCompareEmail = user.email

      User.update({id: req.user.id}, usr).exec(function (err, users) {
        if (err || users.length == 0) {
          Reporting.logError(err, __filename, req.user)
          res.negotiate(err)
        }
        else {
          if(users[0].email != toCompareEmail){
            User.update({id: req.user.id}, {email_verified: false}).exec(function (err, users) {
              if(err) Reporting.logError(err, __filename, req.user)
              if(!err && users && users.length > 0){
                EmailService.sendVerificationEmail(users[0], UtilityService.constructEmailVerificationLink(users[0]), sails.config.appName)

              }
            })
          }
          Analytics.track('server:user edited profile', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
          })
          UserService.updateUserInfoCookie(res, users[0])
          res.ok(users[0].toJSON())
        }
      })

    })

  },

  /* *
   * Update user password
   *
   * (POST /user/updatePassword/)
   */
  updatePassword: function (req, res) {
    // var user = UserService.getCurrUserInfo(req)
    console.log(req.param("reset_token"))
    var query = req.user ? {where:{id: req.user.id}, select:['password']} : {where:{reset_token: req.param("reset_token"), reset_token_expires:{ '>' : moment().toISOString()}}, select:['password']}
    User.findOne(query, function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      if (req.user) {
        if (user.password) {
          //  Load the bcrypt module
          var currPassord = req.param("currPassword")
          console.log(currPassord)
          bcrypt.compare(currPassord, user.password, function (err, result) {
            //  res === false

            if (err || !result) {
              Reporting.logError(err, __filename, req.user)
              return res.forbidden("Wrong current password")
            } else {
              //  res === true
              //  Store new password in database
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.param('newPassword'), salt, null, function (err, hash) {
                  if (err || !hash) return res.negotiate(err)
                  User.update({id: req.user.id}, {password: hash}).exec(function (err, users) {
                    if (err || users.length == 0) {
                      Reporting.logError(err, __filename, req.user)
                      res.negotiate(err)
                    }
                    else {
                      Analytics.track('Profile update', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
                      })
                      UserService.updateUserInfoCookie(res, users[0])
                      res.ok(users[0].toJSON())
                    }
                  })
                })
              })

            }

          })
        } else {
          //  res === true
          //  Store new password in database
          updateUserPassword(req.param('newPassword'), req.user.id, function (err, user) {
            if (err || !user) return res.negotiate(err)
            UserService.updateUserInfoCookie(res, user)
            return res.ok(user.toJSON())
          })
        }
      } else if (req.param('user_id') && _.isNumber(parseInt(req.param('user_id')))) {
        console.log('updatinggg')
        updateUserPassword(req.param('newPassword'), req.param('user_id'), function (err, user) {
          if (err || !user) return res.negotiate(err)
          return res.ok()
        })
      } else return res.badRequest()
    })

  },

  /* *
   * Request an email to be sent for performing password reset
   *
   * (POST /user/resetpassreq/)
   */
  resetpassreq: function (req, res) {

    var email = req.param('email')
    var resetToken = require("randomstring").generate()

    User.update({email: email}, {
      reset_token: resetToken,
      reset_token_expires: moment().add(1, 'h').toString()
    }).exec(function (err, user) {

      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      var protocol = req.connection.encrypted ? "https://" : "http://"

      var path = '/user/reset/' + resetToken

      EmailService.sendResetPassEmail(email, protocol + req.headers.host + path)

      return res.ok({succ: true})

    })
  },

  resetpass: function (req, res) {

    User.findOne({where: {reset_token: req.param("reset_token")}, select:['id', 'reset_token_expires']}).exec(function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      if (moment() < moment(user.reset_token_expires)) {

        return res.ok({user_id: user.id})
      } else {
        return res.forbidden("Expired reset token")
      }

    })

  },

  // MobileVerification and NonUserMobileVerification services use noSQL database
  // for storing mobile verification codes temporarily until verified.
  // This done for mobile requests as sessions do not persist

  /* *
   * Construct and send random code to user mobile to verify
   *
   * (POST /user/sendMobileCode/)
   */
  sendMobileCode: function (req, res) {
    var phone = req.param("phone")
    var code = Math.floor((Math.random() * 999999) + 111111)
    /* code = "1234"req.session.tempMobile = {code: code, number:phone}res.json({ succ: true })*/
    EmailService.sendSMS(phone, "Your " + sails.config.appName + " verification code is: " + code,
      function (data) {
        console.log(data)
        if (data)
          return res.serverError('Sending SMS error')

        // As sessions do not work with mobile requests, we try to use database to store codes until it's verified
        // if(req.headers["mobile"]){
        //   if(req.user)
        //     MobileVerificationService.addCode(req.user.id, code, phone)
        //   else
        //     NonUserMobileVerificationService.addCode(code, phone)
        // } else
          req.session.tempMobile = {code: code, number: phone}

        res.ok({succ: data == null})
      })
  },

  /* *
   * Verify mobile code sent to user
   *
   * (POST /user/verifyMobileCode/)
   */
  verifyMobileCode: function (req, res) {
    var code = req.param('code')
    var phone = req.param('phone')

    if(req.session.tempMobile)
      return compareMobileCode(req, res, code, req.session.tempMobile.code, req.session.tempMobile.number)

    // As sessions do not work with mobile requests, we try to use database to store codes until it's verified
    // If user is verifying from signup form before being saved to database, req will not have user param

    // if(req.user) {
    //   MobileVerificationService.getUserCode(req.user.id, function (err, result) {
    //     if (err) {
    //       Reporting.logError(err, __filename, req.user)
    //       res.negotiate(err)
    //     } else {
    //       if (!result || result.Items.length === 0)
    //         return res.badRequest('Please request a code to verify')
    //
    //       if (moment().diff(moment(result.Items[0].TimeStamp), 'minutes') > 15) {
    //         return res.badRequest('Code expired, Please request another code to verify')
    //       }
    //
    //       compareMobileCode(req, res, code, result.Items[0].Code, result.Items[0].Phone)
    //     }
    //
    //   })
    // } else {
    //   NonUserMobileVerificationService.getCode(phone, function (err, result) {
    //     if (err) {
    //       Reporting.logError(err, __filename, req.user)
    //       res.negotiate(err)
    //     } else {
    //       if (!result || result.Items.length === 0)
    //         return res.badRequest('Please request a code to verify')
    //
    //       if (moment().diff(moment(result.Items[0].TimeStamp), 'minutes') > 15) {
    //         return res.badRequest('Code expired, Please request another code to verify')
    //       }
    //
    //       if(result.Items[0].Code == code) {
    //         NonUserMobileVerificationService.addVerifiedCode(code, phone, function (err, data) {
    //           if (err) {
    //             Reporting.logError(err, __filename, req.user)
    //             return res.negotiate(err)
    //           }
    //
    //           return res.json(200, 'Match Success')
    //         })
    //       } else {
    //         return res.badRequest("Mobile verification code entered does not match")
    //       }
    //     }
    //
    //   })
    // }

  },

  /* *
   * Upload avatar for currently logged-in user
   *
   * (POST /user/avatar)
   */
  uploadAvatar: function (req, res) {
    // console.log(req)
    req.file('avatar').upload({

      // Images should be uploaded to cloud storage to be secured from accidential deletion
      // Next code uses AWS S3

      // dirname: require('path').resolve(sails.config.appPath, '/images/avatars'),
      //  don't allow the total upload size to exceed ~2MB
      // adapter: require('skipper-better-s3'),
      // endpoint: sails.config.aws.s3endpoint,
      // key: sails.config.aws.accessKeyId,
      // secret: sails.config.aws.secretAccessKey,
      // bucket: '{{S3 BUCKET NAME}}',
      // region: sails.config.aws.region,  // Optional - default is 'us-standard'
    maxBytes: 2000000,
      // s3params:
      // {
      //   signatureVersion: 'v4',
      //   ACL: 'public-read'
      // }
    }, function whenDone (err, uploadedFiles) {
      if (err) {
        return res.negotiate(err)
      }

      //  If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded')
      }

      var newAvatarUrl = require('util').format('%s/user/avatar/%s', sails.config.appUrl, req.user.id)
      //  Save the "fd" and the url where the avatar for a user can be accessed
      User.update({id: req.user.id}, {

          //  Generate a unique URL where the avatar can be downloaded.
          // avatarUrl: newAvatarUrl,

          //  Grab the first file and use it's `fd` (file descriptor)
          avatarFd: uploadedFiles[0].fd
        })
        .exec(function (err, users) {
          if (err) return res.negotiate(err)
          if(!users || users.length == 0) return res.notFound("User not Found")

          UserService.updateUserInfoCookie(res, users[0])
          // req.session.currUserPhoto = newAvatarUrl
          return res.ok(newAvatarUrl)
        })
    })
  },

  /* *
   * Download avatar of the user with the specified id
   *
   * (GET /user/avatar/:id)
   */
  avatar: function (req, res) {

    req.validate({
      id: 'string'
    })

    User.findOne({where: {id: req.param('id')}, select:['avatarFd']}).exec(function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      //  User has no avatar image uploaded.
      //  (should have never have hit this endpoint and used the default image)
      if (!user.avatarFd) {
        return res.notFound('No avatar image found')
      }

      var SkipperS3 = require('skipper-disk')
      var fileAdapter = SkipperS3({
        // endpoint: sails.config.aws.s3endpoint,
        // key: sails.config.aws.accessKeyId,
        // secret: sails.config.aws.secretAccessKey,
        // bucket: '{{S3 BUCKET NAME}}',
        // region: sails.config.aws.region,  // Optional - default is 'us-standard'
      })

      //  Stream the file down
      fileAdapter.read(user.avatarFd)
        .on('error', function (err) {
          return res.serverError(err)
        })
        .pipe(res)
    })
  },

  getCities: function (req, res) {
    if(!req.param('country'))
      return res.ok([])

    if(req.param('country') == 'EG')
      return res.ok(['Cairo', 'Alexandria'])

    var countryName = require("country-data").lookup.countries({alpha2: req.param('country')})[0]

    res.ok(require("countries-cities").getCities(countryName.name))
  },

}

