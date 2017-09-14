exports.renderPage = function(request, response) {
    response.set(404);
    // when ready, need to change this to a render command and insert the view to render
    response.render('error404');
}