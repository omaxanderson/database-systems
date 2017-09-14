var database = require(__dirname + '/../database.js');

exports.renderPage = function (request, response) {
    // if statement to check whether they are logged in, if they are, need to go to homepage
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        var userId = request.session.userId;
        database.queryForPotentialGames(userId, function(err, resultArray) {
            if(err) {
                console.log(err);
                response.render('error500');
            } else  {
                response.render('addGames' , { potentialGamesArray: resultArray});
            }
        });
    }
}

exports.addUserGame = function (request, response) {
    var newGameId = request.body.field_gameIdOfNewGame;
    var userId = request.session.userId;
    database.insertUserGame(userId, newGameId, function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            response.redirect('addgames');
        }
    });
}

exports.removeUserGame = function (request, response) {
    var removeGameId = request.body.field_gameIdToRemove;
    var userId = request.session.userId;
    database.deleteUserGame(userId, removeGameId, function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            response.redirect('addgames');
        }
    });
}

// exports.requestFriend = function (request, response) {
//     var newFriendId = request.body.field_userIdOfNewFriend;
//     console.log(request.body);
//     response.send(newFriendId);
// }
//
// exports.acceptFriend = function (request, response) {
//     var newFriendId = request.body.field_userIdOfNewFriend;
//     console.log(request.body);
//     response.send(newFriendId);
// }
