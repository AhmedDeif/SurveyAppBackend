module.exports = {

    serverStatus : function (req, res) {
        res.ok('Sha3al yasta');
        console.log("working yasta");
    },

    // Allows the admin to a new question to survey
    addQuestion : function(req, res) {
      console.log("add question", req.body);

        var question = {};
        var responseObj = {};
        var array = [{}];
        if (req.body.body && req.body.isMultiSelect) {
          console.log("add question if");

            question.body = req.body.body;
            question.isMultiSelect = req.body.isMultiSelect;
            question.active = req.body.active;
            SurveyService.addQuestionToSurvey(question, function(err, record) {
                if (err) {
                  console.log("add question if error");

                    responseObj.error = "Server error";
                    responseObj.data = false;

                }
                else {
                  // on success if answers exist add them to created question
                    responseObj.data = record;
                    responseObj.error = false;
                    if (req.body.answers) {
                      // SurveyController.addAnswer(req, res);
                      array = req.body.answers;
                      var tempObject = {};
                 			for (var i = 0 ; i<array.length ; i++){
                 					tempObject.body = array[i].body;
                 					tempObject.value = array[i].value;
                 					tempObject.isNumerical = array[i].isNumerical;
                          tempObject.question = record.id;

                          if (tempObject) {

                              SurveyService.addAnswer(tempObject, function(err, record) {
                                  if (err) {
                                      responseObj.error = "Server error";
                                      responseObj.data = false;
                                  }
                                  else {
                                      responseObj.data = record;
                                      responseObj.error = false;

                                  }
                              });
                          }
                 					tempObject = {};
                 			}
                      // END
                    }
                }
                res.json(responseObj);
            });
        }
        else {
            console.log("add question else");
            responseObj.error = "Missing Parameters";
            responseObj.data = false;

            res.json(responseObj);
        }
    },

    // Allows the admin to remove a question from survey, set as inactive
    removeQuestion: function(req, res) {
        var responseObj = {};
        var id = req.param('id');

        if(id) {

            SurveyService.removeQuestionFromSurvey(id, function(err, record) {
                if (err) {

                    responseObj.error = "Server error";
                    responseObj.data = false;

                }
                else {

                    responseObj.data = record;
                    responseObj.error = false;

                }
                res.json(responseObj);
            });
        }
        else {

            responseObj.error = "Missing Parameters";
            responseObj.data = false;

            res.json(responseObj);
        }
    },

    // Allows the admin to set a question as active
    reactivateQuestion : function(req, res) {
        var responseObj = {};
        if(req.body.question) {
            SurveyService.reactivateQuestion(req.body.question, function(err, record) {
                if (err) {
                    responseObj.error = "Server error";
                    responseObj.data = false;

                }
                else {
                    responseObj.data = record;
                    responseObj.error = false;

                }
                res.json(responseObj);
            });
        }
        else {
            responseObj.error = "Missing Parameters";
            responseObj.data = false;

            res.json(responseObj);
        }
    },

    // Allows the admin to add an answer to a question in survey
    addAnswer : function(req, res) {
      var answer = {};
      var responseObj = {};
      console.log("Add answer func");
      if (req.body.answer.questionId && req.body.answer.value && req.body.answer.isNumerical && req.body.answer.body) {
        console.log("Add answer func if");

          answer.body = req.body.body;
          answer.value = req.body.value;
          answer.isNumerical = req.body.isNumerical;
          answer.question  = req.body.questionId

          SurveyService.addAnswer(answer, function(err, record) {
              if (err) {
                  responseObj.error = "Server error";
                  responseObj.data = false;

              }
              else {
                  responseObj.data = record;
                  responseObj.error = false;

              }
              res.json(responseObj);
          });
      }
      else {
        console.log("Add answer func Missing Parameters");

          responseObj.error = "Missing Parameters";
          responseObj.data = false;

          res.json(responseObj);
      }
    },

    // Allows the admin to remove an answer to a question in survey
    removeAnswer : function(req, res) {

      var responseObj = {};
      if(req.body.id) {
          SurveyService.removeAnswer(req.body.id, function(err, record) {
              if (err) {
                  responseObj.error = "Server error";
                  responseObj.data = false;

              }
              else {
                  responseObj.data = record;
                  responseObj.error = false;

              }
              res.json(responseObj);
          });
      }
      else {
          responseObj.error = "Missing Parameters";
          responseObj.data = false;

          res.json(responseObj);
      }
    },
    // Allows the admin to update an answer
    updateAnswer : function(req,res){
      var responseObj = {};
      var answer = {}
      if(req.body.value && req.body.isNumerical && req.body.body && req.body.id) {
        answer.value = req.body.value;
        answer.isNumerical = req.body.isNumerical;
        answer.body = req.body.body;
        answer.id = req.body.id;
          SurveyService.updateAnswer(answer, function(err, record) {
              if (err) {
                  responseObj.error = "Server error";
                  responseObj.data = false;

              }
              else {
                  responseObj.data = record;
                  responseObj.error = false;

              }
              res.json(responseObj);
          });
      }
      else {
          responseObj.error = "Missing Parameters";
          responseObj.data = false;

          res.json(responseObj);
      }
    },

    // Allows the admin to view a specific response (answers to all questions of a specific user)
    viewResponse : function(req, res) {

    },

    // Allows the admin to set a question as flagged. Flagged questions should return alerts
    // when a certain answer is selected.
    flagQuestion : function(req, res) {

    },

    // Allows the admin to see the average answers of all questions
    viewAverageAnswers : function(req, res) {

    },

    // Allows the user to see the percentage of each answer of a specific question
    viewQuestionAnswers : function(req, res) {

    },
}
