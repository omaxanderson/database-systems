var database = require(__dirname + '/../database.js');
var formidable = require('formidable');

exports.renderPage = function (request, response) {
    if (typeof request.session.userId != 'undefined') {
        response.render('image-upload');
    } else {
        response.redirect('/');
    }
}

exports.attemptImageUpload = function (request, response) {
    var form = new formidable.IncomingForm({uploadDir: __dirname + '/../public/images'});
    form.keepExtensions = true;
    // function (err, field, file) is the callback function when parse is completed
    form.parse(request, function (err, field, file) {
        if (err) {
            console.log('Image upload failed');
        } else {
            var userId = request.session.userId;
            var imageId = extractImageId(file.field_photo.path);
            database.uploadImage(userId, imageId, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    response.send('Upload success');
                }
            });
        }
    });
}

function extractImageId(pathname) {
    return pathname.substr(pathname.lastIndexOf('\\') + 1);
}
