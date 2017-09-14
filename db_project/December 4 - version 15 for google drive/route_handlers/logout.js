exports.logout = function(request, response) {
    request.session.destroy (function(err) {
        if (err) {
            console.log(err);
            response.render('error500');
        } else {
            response.redirect('/');
        }
    })
}
