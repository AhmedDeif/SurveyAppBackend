/**
 * Questions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        isMultiSelect: {
            type:"boolean",
            defaultsTo:false
        },
        active: {
            type:"boolean",
            defaultsTo:true
        },
        body: {
            type: "string"
        },
        answers: {
            collection: 'Answers',
            via: 'question'
        },
    }
};
