var database = require(__dirname + '/../database.js');

exports.renderPage = function (request, response) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        var userId = request.session.userId;
        database.queryUserFriends(userId, function(err, resultArray) {
            if (err) {
                console.log(err);
                response.render('error500');
            } else {
                response.render('sendMessage', {currentFriendsArray: resultArray});
            }
        });
    }
}

exports.sendMsg = function (request, response) {
  var senderId = request.session.userId;
  var recipientId = request.body.dropdown_recipientId;
  var contents = request.body.field_messageContents;
  console.log(contents);
  database.insertMessage(senderId, recipientId, contents, function(err, resultArray) {
     if (err) {
         console.log(err);
         response.render('error500');
     }  else {
         response.redirect('/user/' + senderId);
     }
  });
}
