/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var lookup = require("country-data").lookup;
var bcrypt = require("bcrypt-nodejs");
var uuid = require('node-uuid');

module.exports = {

  attributes: {
    id: {type: "Integer", autoIncrement: true, primaryKey: true},
    uuid: {type: "string", unique: true},
    last_name: "string",
    first_name: "string",
    fb: {type: "string", unique: true},
    fb_access_token: "string",
    admin: {type:"boolean" , default:false} ,
    email: {type: "email", unique: true},
    phone: {type: "string", unique: true},
    avatarFd: "string",
    password: {
      type: 'string',
      //required: true,
      minLength: 6
    },

    // Utils
    toJSON: function () {
      var obj = this.toObject();
      //delete obj.password;
      if (typeof (this.name) === "function") {
        obj.name = this.name();
        obj.profile_pic = this.profile_pic();
        obj.profile_url = this.profile_url();

        //Hide info
        obj.password = obj.password ? true : false
        obj.register_ip = null;
        delete obj.fb_access_token
        delete obj.verification_text
      }

      return obj;
    },
    isAdmin: function () {
        return this.admin;
    },

  },

};
