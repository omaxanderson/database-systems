var database = require(__dirname + '/../database.js');

exports.renderPage = function (request, response) {
    // if statement to check whether they are logged in, if they are, need to go to homepage
    if (typeof request.session.userId != 'undefined') {
        response.redirect('/user/' + request.session.userId);
    } else {
        database.queryForTopFiveGames( function(err, resultArray) {
            if(err) {
                console.log(err);
            } else  {
                if (request.session.failedLogin == true) {
                    response.render('login' , { layout: 'landingpage', loginNotification: "Invalid Username or Password", topGamesArray: resultArray});
                } else {
                    response.render('login' , { layout: 'landingpage', topGamesArray: resultArray});
                }
            }
        });
    }
}

exports.attemptLogin = function (request, response) {
    var userId = request.body.field_userId;
    var password = request.body.field_password;
    database.queryUserIdPassword( userId, password, function(err, loginIsValid) {
        if(err) {
            console.log(err);
        } else if (!loginIsValid) {
            // **** need to figure out how to re-render games array w/ top 5 games ****
            request.session.failedLogin= true;
            response.redirect('/');
        } else {
            request.session.failedLogin= false;
            request.session.userId= userId;
            //response.render('userpage');
            response.redirect('/user/' + userId);
        }
    });
}
