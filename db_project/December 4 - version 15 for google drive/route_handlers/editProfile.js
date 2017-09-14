var database = require(__dirname + '/../database.js');
var formidable = require('formidable');

exports.checkLoggedIn = function (request, response, next) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        next();
    }
}

exports.getCurrentUsername = function (request, response, next) {
    var pageOwnerId = request.session.userId;
    database.queryUsername(pageOwnerId, function(err, rows) {
        if(err) {
            console.log(err);
            response.render('error500');
        } else if (rows.length == 0) {
            console.log('user does not exist');
            response.render('error500');
        } else {
            var returnedUsername = rows[0].Username;
            request.username = returnedUsername;
            next();
        }
    })

}

exports.getProfilePicImagePath = function (request, response, next) {
    var pageOwnerId = request.session.userId;
    database.queryProfilePictureImageId(pageOwnerId, function(err, rows) {
        if (err) {
            console.log(err);
            response.render('error500');
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

exports.renderPage = function (request, response) {
    if (typeof request.session.userId != 'undefined') {
        response.render('editProfile', {
            currentUsername: request.username,
            currentProfilePic: request.profilePictureImageId
        });
    } else {
        response.redirect('/');
    }
}

exports.editUsername = function (request, response) {
    var userId = request.session.userId;
    var newUsername = request.body.field_updateUsername;
    console.log(request.body);
    database.updateUsername(userId, newUsername, function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            response.redirect('editProfile');
        }
    })

}

exports.editProfilePic = function (request, response) {
    var form = new formidable.IncomingForm({uploadDir: __dirname + '/../public/images'});
    form.keepExtensions = true;
    // function (err, field, file) is the callback function when parse is completed
    form.parse(request, function (err, field, file) {
        if (err) {
            console.log('Image upload failed');
        } else {
            var userId = request.session.userId;
            var imageId = extractImageId(file.field_photo.path);
            database.updateProfilePic(userId, imageId, function (err) {
                if (err) {
                    console.log(err);
                    response.render('error500');
                } else {
                    response.redirect('editProfile');
                }
            });
        }
    });
}

function extractImageId(pathname) {
    return pathname.substr(pathname.lastIndexOf('\\') + 1);
}