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
            console.log("RES DATA= "+resData);
            res.send(resData);
        });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.send(req.user);
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
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };
};
