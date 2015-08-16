module.exports = function(app, request, async, passport) {

    app.get('/', isLoggedIn, function(req, res) {
        res.sendfile('public/pages/app.html');
    });

    app.get('/login', function(req, res) {
        res.sendfile('public/pages/login.html');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/venmo', passport.authenticate('venmo', { scope: [
        'make_payments',
        'access_payment_history',
        'access_feed',
        'access_profile',
        'access_email',
        'access_phone',
        'access_balance',
        'access_friends'
    ]}));

    app.get('/auth/venmo/callback',
        passport.authenticate('venmo', { failureRedirect: '/login'}),
        function(req, res) {
            res.redirect('/');    
    });

    app.get('/friends', isLoggedIn, function(req, res) {
        getFriendsList(req.user.uid, req.user.access_token, function(error, resData) {
            console.log("RES DATA= "  +resData);
            res.send(resData);
        });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        console.log("profile route hit");
        payHistory(req.user.access_token, req.user.username, function(error, data) {
            var user = req.user;
            var profileData = {
                profile: user,
                graph: data
            };
            console.log("User profile returning "+profileData);
            res.send(profileData);
        });
    });


    function getFriendsList(userId, userToken, callback) {
        var venmoUrl = 'https://api.venmo.com/v1/users/'+userId+'/friends?access_token='+userToken+'&limit=300'; 
        var options = {
            url: venmoUrl
        };
        console.log("venmoUrl="+venmoUrl);
        console.log("User Token="+userToken);
        
        request.get(options, function(error, response, body) {
            if (!error) {
                console.log("BODY= "+body);
                var bodyData = JSON.parse(body);
                console.log("WE AMDE IT TO THE REQ "+bodyData);
                callback(error, bodyData);
            }
        });
    };

    function paymentFriendsList(userToken, friendsList, callback) {
        var venmoUrl ='https://api.venmo.com/v1/payments?access_token='+userToken;
        var options = {
            url: venmoUrl
        };
        request.get(options, function(error, response, body) {
            if(!error) {
                var bodyData = JSON.parse(body);
                for(var i in bodyData) {
                    for (var z in bodyData) {

                    }
                }
            }
        });

    };

    function payHistory(userToken, username, callback) {
        var venmoUrl ='https://api.venmo.com/v1/payments?access_token='+userToken+'&limit=1000';
        var options = {
            url: venmoUrl
        };
        var charged = 0;
        var payed = 0;
        
        console.log("URL: "+venmoUrl);
        console.log("Before request to payment"); 
        request.get(options, function(error, response, body) {
            if (!error) {
                var bodyData = JSON.parse(body);
                console.log("BODY COUNT="+bodyData.data.count);
                for(var i in bodyData.data) {
                    if(bodyData.data[i].status === "settled" || bodyData.data[i].status === "pending") {
                        if (bodyData.data[i].status === "pending") {
                            console.log(bodyData.data[i]);
                        }
                        if (bodyData.data[i].action === "pay") {
                            if (bodyData.data[i].actor.username != username) {
                                charged += bodyData.data[i].amount;
                            } else {
                                payed += bodyData.data[i].amount;
                            }
                        } else if (bodyData.data[i].action === "charge") {
                            if (bodyData.data[i].actor.username != username) {
                                payed += bodyData.data[i].amount;
                            } else {
                                charged += bodyData.data[i].amount;
                            }
                        } 
                    }
                }
                var results = {
                    charged: charged,
                    payed: payed
                };
                callback(error, results);
            }
        });
    };
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };
};
