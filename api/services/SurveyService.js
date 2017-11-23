
module.exports = {

    addQuestionToSurvey : function (question, callback) {
        // check that all attributes are present
        if (question.body) {
            Questions.create(question).exec(function(err, record) {
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
}
