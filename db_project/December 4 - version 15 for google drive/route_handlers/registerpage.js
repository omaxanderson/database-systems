var database = require(__dirname + '/../database.js');
var formidable = require('formidable');

exports.renderPage = function (request, response) {
    if (typeof request.session.userId != 'undefined') {
        // if user is already logged in, they don't need to register - redirect to homepage
        response.render('userpage');
    } else {
        response.render('register');
    }
}

exports.attemptToRegisterUser = function (request, response) {
    var userId = request.body.field_userId;
    var password = request.body.field_password;
    var email = request.body.field_email;
    database.insertNewUser( userId, password, email, function(err) {
        if(err) {
            // insert logic for rendering page if page failed
            response.send('Registration failed');
            console.log(err);
        } else {
            request.session.userId= userId;
            response.render('userpage');
        }
    });
}
