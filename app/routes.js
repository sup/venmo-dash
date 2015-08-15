module.exports = function(app, request, async, passport) {

    app.get('/', isLoggedIn, function(req, res) {
        res.sendfile('public/pages/app.html');
    });

    app.get('/login', function(req, res) {
        res.sendfile('public/pages/login.html');
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

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };
};
