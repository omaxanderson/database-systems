var database = require(__dirname + '/../database.js');

exports.checkLoggedIn = function (request, response, next) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        next();
    }
}

exports.getPendingFriendRequests = function (request, response, next) {
    var userId = request.session.userId;
    database.queryFriendRequestsNeedingApproval(userId, function(err, rows) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            request.requestsNeedingApproval = rows;
            next();
        }
    });
}

exports.getOutboundFriendRequests = function (request, response, next) {
    var userId = request.session.userId;
    database.queryFriendRequestsAwaitingApproval(userId, function(err, rows) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            request.requestsAwaitingApproval = rows;
            next();
        }
    });
}

exports.getPotentialFriends = function (request, response, next) {
    var userId = request.session.userId;
    database.queryForPotentialFriends(userId, function(err, rows) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            request.potentialFriends = rows;
            next();
        }
    });
}

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
        response.render('friendsearch', {
            requestsNeedingApprovalArray: request.requestsNeedingApproval,
            requestsAwaitingApprovalArray: request.requestsAwaitingApproval,
            potentialFriendsArray: request.potentialFriends,
            currentFriendsArray: request.currentFriends
        })
    }
}


// exports.renderPage = function (request, response) {
//     // if statement to check whether they are logged in, if they are, need to go to homepage
//     if (typeof request.session.userId == 'undefined') {
//         response.redirect('/');
//     } else {
//         var userId = request.session.userId;
//         database.queryForPotentialFriends(userId, function(err, resultArray) {
//             if(err) {
//                 console.log(err);
//             } else  {
//                 response.render('friendsearch' , { potentialFriendsArray: resultArray});
//             }
//         });
//     }
// }

exports.requestFriend = function (request, response) {
    var newFriendId = request.body.field_userIdOfPotentialFriend;
    var currentUserId = request.session.userId;
    database.insertFriendRequest(currentUserId, newFriendId, function (err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            response.redirect('/friendsearch');
        }
    })
}

exports.acceptFriend = function (request, response, next) {
    var newFriendId = request.body.field_userIdOfNewFriend;
    var currentUserId = request.session.userId;
    database.insertFriendship(currentUserId, newFriendId, function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            next();
        }
    });
}

exports.deleteFriendRequest = function (request, response, next) {
    var newFriendId = request.body.field_userIdOfNewFriend;
    var currentUserId = request.session.userId;
    database.deleteFriendRequest(currentUserId, newFriendId, function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            next();
        }
    });
}

exports.redirectOnFinish = function (request, response) {
    response.redirect('/friendsearch');
}

exports.deleteFriend = function (request, response) {
    var idOfFriendToDelete = request.body.field_userIdOfDeletedFriend;
    var currentUserId = request.session.userId;
    database.deleteFriendFromUser(currentUserId, idOfFriendToDelete, function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            response.redirect('/friendsearch');
        }
    });
}