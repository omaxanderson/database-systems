var database = require(__dirname + '/../database.js');

exports.getCurrentFriends = function (request, response, next) {
    var userId = request.session.userId;
    database.queryUserFriends(userId, function(err, rows) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            request.currentFriends = rows;
            next();
        }
    });
}

exports.renderPage = function (request, response) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        var userId = request.session.userId;
        database.queryUserMessages(userId, function(err, rows) {
            if (err) {
                console.log(err);
                reponse.render('error500');
            } else {
                var numOfMessages = rows.length;
                response.render('userinbox', {
                    numberOfMessages : numOfMessages,
                    messagesArray : rows,
                    currentFriendsArray : request.currentFriends
                });
            }
        });
    }
}
