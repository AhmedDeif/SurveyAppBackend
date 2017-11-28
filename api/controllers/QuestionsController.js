/**
 * QuestionsController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getActiveQuestions: function(req,res){
		var responseObj = {};
				QuestionService.getActiveQuestions(function(err, record) {
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
};
