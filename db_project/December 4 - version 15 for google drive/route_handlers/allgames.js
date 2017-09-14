var database = require(__dirname + '/../database.js');

exports.renderPage = function (request, response) {
    database.queryForAllGames( function(err, resultArray) {
       if (err) {
           console.log(err);
           response.send('error500');
       }  else {
           response.render('allgames', { allGamesArray: resultArray});
       }
    });
}