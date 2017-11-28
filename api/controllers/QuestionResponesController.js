/**
 * QuestionResponesController
 *
 * @description :: Server-side logic for managing Questionrespones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addResponse: function(req,res){
		var response = [];
		var tempObject  = {};
		var responseObj = {};
		var array = [];

		if (req.body.questionId && req.body.answers && req.body.responseId) {
		 array = req.body.answers;
			for (var i = 0 ; i<array.length ; i++){
				if (array[i] != ',' && array[i] != '[' && array[i] != ']'){
					tempObject.question = req.body.questionId;
					tempObject.response = req.body.responseId;
					tempObject.answer = array[i];
					response.push(tempObject);
					tempObject = {};
				}
			}


				console.log("Response " , response);
				SurveyService.addResponse(response, function(err, record) {
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
	}
};
