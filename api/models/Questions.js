/**
 * Questions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        flagged: { type:"boolean", default:false },
        isMultiSelect: { type:"boolean", default:false },
        active: { type:"boolean", default:true },
        body: {type: "string"},
        answers: {
            collection: 'Answers',
            via: 'question'
        },
    }
};
