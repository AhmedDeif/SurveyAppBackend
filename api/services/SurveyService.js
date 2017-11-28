
module.exports = {

    addQuestionToSurvey : function (question, callback) {
        // check that all attributes are present
        if (question.body) {
            Questions.create(question).exec(function(err, record) {
                if (err) {
                    console.log('An error has occured',err);
                    console.log(question)
                    callback(err, null);
                }
                else {
                    callback(null, record);
                }
            });
        }
        else {
            console.log('Missing attributes, cannot create question');
            callback('Missing attributes, cannot create question', null);
        }
    },

    removeQuestionFromSurvey: function(questionId, callback) {
        if (questionId) {
            Questions.update({id:questionId}, {active: false}).exec(function(err, updatedRecords){
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, updatedRecords);
                }
            });
        }
        else {
            callback('Missing attributes, question does not exist', null);
        }
    },


    reactivateQuestion: function(questionId, callback) {
        if (questionId) {
            Questions.update({id:questionId}, {active: true}).exec(function(err, updatedRecords){
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, updatedRecords);
                }
            });
        }
        else {
            callback('Missing attributes, question does not exist', null);
        }
    },

    addAnswer: function(answer,callback) {
        if (answer) {
          Answers.create(answer).exec(function(err, record) {
              if (err) {
                  console.log('An error has occured');
                  callback(err, null);
              }
              else {
                  callback(null, record);
              }
          });
        }
        else {
            callback('Missing attributes,Can not create answer', null);
        }
    },

    removeAnswer: function(answerId, callback) {
        if (answerId) {
            Answers.destroy({id:answerId}).exec(function(err,record){
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, "Removed successfully");
                }
            });
        }
        else {
            callback('Missing attributes, answer does not exist', null);
        }
    },

    updateAnswer: function(answer, callback) {
        if (answer) {
            Answers.update({id:answer.id},{value: answer.value, body: answer.body, isNumerical: answer.isNumerical}).exec(function(err,updatedRecords){
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, updatedRecords);
                }
            });
        }
        else {
            callback('Missing attributes, answer does not exist', null);
        }
    },
    addResponse: function(response,callback) {
      console.log("Service " , response);
        if (response) {
          QuestionRespones.create(response).exec(function(err, record) {
              if (err) {
                  console.log('An error has occured');
                  callback(err, null);
              }
              else {
                  callback(null, record);
                  console.log("Record created " , record);
              }
          });
        }
        else {
            callback('Missing attributes,Can not create response', null);
        }
    },
    addSurveyResponse: function(response,callback) {
        if (response) {
          SurveyRespones.create(response).exec(function(err, record) {
              if (err) {
                  console.log('An error has occured');
                  callback(err, null);
              }
              else {
                  callback(null, record);
              }
          });
        }
        else {
            callback('Missing attributes,Can not create survey response', null);
        }
    },

}
