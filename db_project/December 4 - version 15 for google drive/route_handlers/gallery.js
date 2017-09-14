var database = require(__dirname + '/../database.js');
var formidable = require('formidable');

// exports.renderPage = function (request, response) {
//     if (typeof request.session.userId == 'undefined') {
//         response.redirect('/');
//     } else {
//         var ownerId = request.params.userIdParam;
//         database.queryUserImages(ownerId, function (err, resultArray) {
//            if (err) {
//                console.log(err);
//                response.redirect('error500');
//            } else {
//                if (ownerId == request.session.userId) {
//                    response.render('gallery', { uploadAllowed: true, imageIdArray: resultArray});
//                } else {
//                    response.render('gallery', { uploadAllowed: false, imageIdArray: resultArray});
//                }
//            }
//         });
//     }
// }

exports.renderPage = function (request, response) {
    if (typeof request.session.userId == 'undefined') {
        response.redirect('/');
    } else {
        var ownerId = request.session.userId;
        database.queryUserImages(ownerId, function (err, resultArray) {
            if (err) {
                console.log(err);
                response.redirect('error500');
            } else {
                response.render('gallery', {imageIdArray: resultArray});
            }
        });
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
                    response.render('error500');
                } else {
                    response.redirect('/gallery');
                }
            });
        }
    });
}

function extractImageId(pathname) {
    return pathname.substr(pathname.lastIndexOf('\\') + 1);
}