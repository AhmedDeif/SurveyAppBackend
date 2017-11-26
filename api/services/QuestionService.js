
module.exports = {
  // returns all active questions
  getActiveQuestions: function(callback) {

      Questions.find({active: true}).populateAll().exec(function(err, records){
          if (err) {
                callback(err, null);
          }
          else {
                callback(null, records);
            }
          });
  },


}
