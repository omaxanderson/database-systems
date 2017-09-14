// loads route handlers and handles defining the routes

var routes = require(__dirname + '/route_handlers/routeHandlerModules');

module.exports = function(server) {
    // sets routing for the login page
    //server.get('/', routes.loginpage.renderPage);

    // sets default route to 404 to route all undefined pages to 404 error page
    //server.use(routes.error404.renderPage);


    // server.route('/')
    //     .get(routes.loginpage.renderPage);
    // server.use(routes.error404.renderPage);
    server.get('/', routes.loginpage.renderPage);
    server.post('/', routes.loginpage.attemptLogin);

    server.get('/imageuploadpage', routes.imageuploadpage.renderPage);
    server.post('/imageuploadpage', routes.imageuploadpage.attemptImageUpload);

    server.get('/registerpage', routes.registerpage.renderPage);
    server.post('/registerpage', routes.registerpage.attemptToRegisterUser);

    //*********** DO NOT FORGET THE MODULE NAME IN ROUTES.MODULENAME.FUNCTIONNAME !!!!!!
    server.get('/user/:userIdParam', routes.userpage.checkLoggedIn,
                                     routes.userpage.getProfilePicImagePath,
                                     routes.userpage.getUserPosts,
                                     routes.userpage.getUserFriends,
                                     routes.userpage.getUserGames,
                                     routes.userpage.renderPage);
    server.post('/user/:userIdParam', routes.userpage.addUserPost);

    server.get('/inbox', 
               routes.userinbox.getCurrentFriends,
               routes.userinbox.renderPage);

    server.get('/friendsearch', routes.friendsearch.checkLoggedIn,
                                routes.friendsearch.getPendingFriendRequests,
                                routes.friendsearch.getOutboundFriendRequests,
                                routes.friendsearch.getPotentialFriends,
                                routes.friendsearch.getCurrentFriends,
                                routes.friendsearch.renderPage);
    server.post('/requestFriend', routes.friendsearch.requestFriend);
    server.post('/acceptFriend', routes.friendsearch.acceptFriend,
                                 routes.friendsearch.deleteFriendRequest,
                                 routes.friendsearch.redirectOnFinish);
    server.post('/declineFriend', routes.friendsearch.deleteFriendRequest,
                                  routes.friendsearch.redirectOnFinish);
    server.post('/deleteFriend', routes.friendsearch.deleteFriend);

    // server.get('/pendingFriendRequests', routes.pendingFriendRequests.renderPage);

    server.get('/sendMessage', routes.sendMessage.renderPage);
    server.post('/sendMessage', routes.sendMessage.sendMsg);

    //server.get('/user/:userIdParam/gallery', routes.gallery.renderPage);
    //server.post('/user/:userIdParam/gallery', routes.gallery.attemptImageUpload);

    server.get('/gallery', routes.gallery.renderPage);
    server.post('/gallery', routes.gallery.attemptImageUpload);

    server.get('/editProfile', routes.editprofile.checkLoggedIn,
                               routes.editprofile.getCurrentUsername,
                               routes.editprofile.getProfilePicImagePath,
                               routes.editprofile.renderPage);
    server.post('/editUsername', routes.editprofile.editUsername);
    server.post('/editProfilePic', routes.editprofile.editProfilePic);

    server.get('/games', routes.allgames.renderPage);

    server.get('/addGames', routes.addgames.renderPage);
    server.post('/addGames', routes.addgames.addUserGame);
    server.post('/removeGame', routes.addgames.removeUserGame);

    server.get('/logout', routes.logout.logout);


}

// about:config
// browser.cache.disk.enable
