var sqlite3 = require('sqlite3').verbose();

// queries the gamersnet database for the top 5 games
exports.queryForTopFiveGames = function (callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT Game.title, Game.GameImageFileName, Count(Plays.userId) AS NumPlayers ' +
                      'FROM Game LEFT NATURAL JOIN Plays ' +
                      'GROUP BY Game.gameId ORDER BY NumPlayers ' +
                      'DESC, Title ASC LIMIT 5';
    database.serialize( function () {
        database.all(queryString, function (err, rows) {
            if (err) {
                callback(err);
            }
            database.close();
            callback(null, rows);
        });
    });
}

exports.queryForAllGames = function (callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT Game.title, Game.GameImageFileName, Count(Plays.userId) AS NumPlayers ' +
                      'FROM Game LEFT NATURAL JOIN Plays ' +
                      'GROUP BY Game.gameId ORDER BY NumPlayers ' +
                      'DESC, Title';
    database.serialize( function () {
        database.all(queryString, function (err, rows) {
            if (err) {
                callback(err);
            }
            database.close();
            callback(null, rows);
        });
    });
}

// queries the gamersnet database for a matching userId and password for login purposes
exports.queryUserIdPassword = function (userId, password, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT UserId FROM User ' +
                      'WHERE UserId LIKE \'' + userId +
                      '\' AND Password = \'' + password + '\'';
    database.serialize( function() {
        database.all(queryString, function (err, rows) {
            if (err) {
                callback(err);
            }
            database.close();
            if (rows.length != 0) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    });
}

// inserts a new imageId into the Picture table of the gamersnet database for the specified user
exports.uploadImage = function (userId, imageId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'INSERT INTO Picture(UserId,ImageId) VALUES (\'' + userId + '\',\'' + imageId + '\')';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

// inserts a new user into the User table of the gamersnet database - for use during registration
exports.insertNewUser = function (userId, password, email, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    // inserts userId as the default starting username for the new user
    var queryString = 'INSERT INTO User (UserId, Password, Username, Email) VALUES (\'' +
                      userId + '\',\'' + password + '\',\'' + userId + '\',\'' + email + '\')';
    console.log(queryString);
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

// queries the database for the id of the specified user's profile picture
exports.queryProfilePictureImageId = function(userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT ProfilePicId FROM User WHERE UserId LIKE \'' + userId + '\'';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.queryUserPosts = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT Timestamp, Contents FROM Post ' +
                      'WHERE UserId = \'' + userId + '\' ORDER BY Timestamp DESC';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.queryUserFriends = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT User.UserId, User.username ' +
                      'FROM User ' +
                      'WHERE User.UserId IN (SELECT Friends_with.user1 ' +
                                             'FROM Friends_with ' +
                                             'WHERE Friends_with.user2 = \'' + userId + '\' ' +
                                             'UNION ' +
                                             'SELECT Friends_with.user2 ' +
                                             'FROM Friends_with ' +
                                             'WHERE Friends_with.user1 = \'' + userId + '\')';
    database.serialize( function () {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.queryUserGames = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT Title FROM Game NATURAL JOIN Plays WHERE UserId=\'' + userId +
                      '\' ORDER BY Title ASC';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.queryUserMessages = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT User.Username, Message.Timestamp, Message.Contents ' +
                      'FROM USER JOIN Message on User.UserId = Message.Sender ' +
                      'WHERE Message.recipient = \'' + userId + '\' ORDER BY Message.Timestamp DESC';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.queryForPotentialFriends = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT UserId, Username, ' +
                      '(CASE WHEN UserId IN (SELECT UserID ' +
                                            'FROM Friend_request JOIN USER ' +
                                            'ON UserID = Friend_request.recipient ' +
                                            'WHERE Friend_request.sender = \'' + userId + '\') ' +
                            'THEN 1 ELSE 0 end) as outboundRequestPending, ' +

                      '(CASE WHEN UserID IN (SELECT UserID ' +
                                            'FROM Friend_request JOIN USER ' +
                                            'ON UserID = Friend_request.sender ' +
                                            'WHERE Friend_request.recipient =\'' + userId + '\')' +
                            'THEN 1 ELSE 0 end) as inboundRequestPending ' +
                      'FROM User ' +
                      'WHERE UserId <> \'' + userId + '\' ' +
                      'AND UserId NOT IN (SELECT Friends_with.user1 ' +
                                          'FROM Friends_with ' +
                                          'WHERE user2 = \'' + userId + '\' ' +
                                          'UNION ' +
                                          'SELECT Friends_with.user2 ' +
                                          'FROM Friends_with ' +
                                          'WHERE user1 = \'' + userId + '\') ORDER BY UserID ASC';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

// queries all friend requests that the userId has sent but need to be approved by the recipient
exports.queryFriendRequestsNeedingApproval = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT UserId, Username ' +
                      'FROM Friend_Request JOIN USER ON UserId = Friend_Request.Sender ' +
                      'WHERE Friend_Request.recipient = \'' + userId + '\'';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

// queries all friend requests that need to be approved by the specified userId
exports.queryFriendRequestsAwaitingApproval = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT UserId, Username ' +
        'FROM Friend_Request JOIN USER ON UserId = Friend_Request.Recipient ' +
        'WHERE Friend_Request.Sender = \'' + userId + '\'';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.insertMessage = function (senderId, recipientId, contents, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'INSERT INTO Message(MessageId, Sender, Recipient, Contents) ' +
                      'VALUES(null, \'' + senderId + '\',\'' + recipientId + '\',\'' + contents + '\')';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.queryUserImages = function (ownerId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT ImageId FROM Picture WHERE UserId = \'' + ownerId + '\'';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.queryUsername = function (userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT Username FROM User WHERE UserId = \'' + userId +'\'';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.updateProfilePic = function (userId, imageId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'UPDATE User SET ProfilePicId = \'' + imageId + '\' ' +
                      'WHERE UserId = \'' + userId + '\'';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.updateUsername = function (userId, newUsername, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'UPDATE User SET Username = \'' + newUsername + '\' ' +
        'WHERE UserId = \'' + userId + '\'';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.insertUserPost = function (userId, contents, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'INSERT INTO Post(PostId, UserId, Contents) ' +
        'VALUES(null, \'' + userId + '\',\'' + contents + '\')';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.queryForPotentialGames = function(userId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'SELECT GameId, Title, ' +
                      '(CASE WHEN GameId IN (SELECT GameId ' +
                      'FROM Game NATURAL JOIN Plays ' +
                      'WHERE UserId = \'' + userId + '\') ' +
                      'THEN 1 ELSE 0 END) as alreadyPlays ' +
                      'FROM Game ORDER BY Title ASC';
    database.serialize( function() {
        database.all(queryString, function(err, rows) {
            if (err) {
                callback(err);
            } else {
                database.close();
                callback(null, rows);
            }
        });
    });
}

exports.insertUserGame = function (userId, gameId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'INSERT INTO Plays(UserId, GameId) VALUES (\'' + userId  + '\', \'' + gameId + '\')';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.deleteUserGame = function (userId, gameId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'DELETE FROM Plays WHERE UserId = \'' + userId + '\' ' +
                      'AND GameId = ' + gameId;
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.insertFriendship = function (userId1, userId2, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'INSERT INTO Friends_with (User1, User2) VALUES(\'' + userId1 + '\', \'' + userId2 + '\')';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.deleteFriendRequest = function (userId1, userId2, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'DELETE from Friend_request WHERE Sender = \'' + userId1 + '\' ' +
                      ' AND Recipient = \'' + userId2 + '\' ' +
                      'OR Sender = \'' + userId2 + '\' AND Recipient = \'' + userId1 + '\'';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.deleteFriendFromUser = function (userId, idOfFriendToDelete, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'DELETE from Friends_with WHERE User1 = \'' + userId + '\' ' +
                      'AND User2 = \'' + idOfFriendToDelete + '\' OR ' +
                      'User1 = \'' + idOfFriendToDelete + '\' AND User2 = \'' + userId + '\'';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

exports.insertFriendRequest = function (senderId, recipientId, callback) {
    var database = new sqlite3.Database('gamersnet.db');
    var queryString = 'INSERT INTO Friend_request (Sender, Recipient) ' +
                      'VALUES(\'' + senderId + '\', \'' + recipientId + '\')';
    // var queryString = 'INSERT INTO Friend_request (Sender, Recipient, Contents) ' +
    //                   'VALUES(\'' + senderId + '\', \'' + recipientId + '\', \'Add me to your friends\')';
    database.serialize( function() {
        database.exec(queryString, callback);
    });
}

