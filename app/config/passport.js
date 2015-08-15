var VenmoStrategy = require('passport-venmo').Strategy;
var User = require('../models/user');

var VENMO_CLIENT_ID = process.env.VENMO_CLIENT_ID;
var VENMO_CLIENT_SECRET = process.env.VENMO_CLIENT_SECRET;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    console.log("CLIENT_ID= "+VENMO_CLIENT_ID);
    console.log("CLIENT_SECRET= "+VENMO_CLIENT_SECRET);

    passport.use(new VenmoStrategy({
        clientID: VENMO_CLIENT_ID,
        clientSecret: VENMO_CLIENT_SECRET,
        callbackURL: "localhost:3000/auth/venmo/callback"
        }, function(accessToken, refreshToken, venmo, done) {
            Users.findOne({
                'venmo.id': venmo.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if(!user) {
                    user = new User({
                        name: venmo.displayName,
                        username: venmo.username,
                        email: venmo.email,
                        provider: 'venmo',
                        venmo: venmo._json,
                        balance: venmo.balance,
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });
                } else {
                    user.balance = venmo.balance;
                    user.access_token = accessToken;
                    user.save();
                    user.venmo = venmo._json;
                    return done(err, user);
                }
           });
        }
    ));
    
};
