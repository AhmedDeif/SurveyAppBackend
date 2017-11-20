/**
 * QuestionRespones.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        response : { model:'SurveyRespones'},
        question : { model:'Questions'},
        answer : { model:'Answers'},
    }
};
