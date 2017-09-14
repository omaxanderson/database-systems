var database = require(__dirname + '/../database.js');

exports.checkLoggedIn = function (request, response, next) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        next();
    }
}

exports.getProfilePicImagePath = function (request, response, next) {
    var pageOwnerId = request.params.userIdParam;
    database.queryProfilePictureImageId(pageOwnerId, function(err, rows) {
       if (err) {
           console.log(err);
       } else if (rows.length == 0) {
           response.send('user does not exist');
       } else {
           var returnedImageId = rows[0].ProfilePicId;
           if (returnedImageId == null) {
               request.profilePictureImageId = '/images/defaultprofilepicture.png';
           } else {
               request.profilePictureImageId = '/images/' + returnedImageId;
           }
           next();
       }
    });
}

exports.getUserPosts = function (request, response, next) {
    var pageOwnerId = request.params.userIdParam;
    database.queryUserPosts(pageOwnerId, function(err, rows) {
       if (err) {
           console.log(err);
       } else {
           request.userPosts = rows;
           next();
       }
    });
}

exports.getUserFriends = function(request, response, next) {
    var pageOwnerId = request.params.userIdParam;
    database.queryUserFriends(pageOwnerId, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            request.userFriends = rows;
            next();
        }
    });
}

exports.getUserGames = function(request, response, next) {
    var pageOwnerId = request.params.userIdParam;
    database.queryUserGames(pageOwnerId, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            request.userGames = rows;
            next();
        }
    });
}

exports.renderPage = function (request, response) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        var pageOwnerId = request.params.userIdParam;
        if (pageOwnerId === request.session.userId) {
            response.render('userpage', {
                profilePicReference : request.profilePictureImageId,
                postsArray : request.userPosts,
                friendsArray : request.userFriends,
                gamesArray : request.userGames,
                allowPost: true
            });
        } else {
            response.render('userpage', {
                profilePicReference : request.profilePictureImageId,
                postsArray : request.userPosts,
                friendsArray : request.userFriends,
                gamesArray : request.userGames,
                allowPost: false
            });
        }
    }
}

exports.addUserPost = function (request, response) {
    var userId = request.session.userId;
    var contents = request.body.field_postContents;
    database.insertUserPost(userId, contents, function(err) {
        if (err) {
            console.log(err);
            response.redirect('error500');
        } else {
           response.redirect('/');
        }
    })
}