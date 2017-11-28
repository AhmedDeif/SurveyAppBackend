/**
 * SurveyResponesController
 *
 * @description :: Server-side logic for managing Surveyrespones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addSurveyResponse: function(req,res){
		var response = {};
		var responseObj = {};
		if (req.body.phone && req.body.last_name && req.body.first_name && req.body.email , req.body.age) {

				response.phone = req.body.phone;
				response.last_name = req.body.last_name;
				response.first_name = req.body.first_name;
				response.email = req.body.email;
				response.age = req.body.age;


				SurveyService.addSurveyResponse(response, function(err, record) {
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
