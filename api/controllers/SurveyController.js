module.exports = {

    serverStatus : function (req, res) {
        res.ok('Sha3al yasta');
    },

    // Allows the admin to a new question to survey
    addQuestion : function(req, res) {
        var question = {};
        var responseObj = {};
        if (req.body.body && req.body.isMultiSelect) {
            question.body = req.body.body;
            question.isMultiSelect = req.body.isMultiSelect;
            SurveyService.addQuestionToSurvey(question, function(err, record) {
                if (err) {
                    responseObj.error = "Server error";
                }
                else {
                    responseObj.data = record;
                }
                res.json(responseObj);
            });
        }
        else {
            responseObj.error = "Missing Parameters";
            res.json(responseObj);
        }
    },

    // Allows the admin to remove a question from survey, set as inactive
    removeQuestion: function(req, res) {
        var responseObj = {};
        if(req.body.question) {
            SurveyService.removeQuestionFromSurvey(req.body.question, function(err, record) {
                if (err) {
                    responseObj.error = "Server error";
                }
                else {
                    responseObj.data = record;
                }
                res.json(responseObj);
            });
        }
        else {
            responseObj.error = "Missing Parameters";
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
                }
                else {
                    responseObj.data = record;
                }
                res.json(responseObj);
            });
        }
        else {
            responseObj.error = "Missing Parameters";
            res.json(responseObj);
        }
    },

    // Allows the admin to add an answer to a question in survey
    addAnswer : function(req, res) {

    },

    // Allows the admin to remove an answer to a question in survey
    removeAnswer : function(req, res) {

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
