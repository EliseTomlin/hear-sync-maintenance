const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://hearsync.onrender.com/auth/google/callback',
        accessType: 'offline', // Request refresh token
        prompt: 'consent', // Forces the consent screen to be displayed
    },
    async (accessToken, refreshToken, profile, done) => {
        // Check if the access token is expired
        if (isTokenExpired(accessToken)) {
            // Access token is expired, refresh it
            const newAccessToken = await refreshAccessToken(refreshToken);

            // Use the new access token for the API request
            // ...
        } else {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            };

            try {
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }));
};

    
//     async (accessToken, refreshToken, profile, done) =>{
//         const newUser = {
//             googleId: profile.id,
//             displayName: profile.displayName,
//             firstName: profile.name.givenName,
//             lastName: profile.name.familyName,
//             image: profile.photos[0].value
//         }
//         try{
//             let user = await User.findOne({googleId: profile.id})

//             if(user){
//                 done(null, user)
//             }else{
//                 user = await User.create(newUser)
//                  done(null, user) 
//             }
//         } catch (err) {
//             console.error(err)
//         }
//     }
// ))
    passport.serializeUser(function(user,done){
        done(null, user.id)
    })

    // passport.deserializeUser(function (id, done){
    //     User.findById(id, function (err,user) {
    //         done(err, user)
    //     })
    // })
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .exec() // Execute the query
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
    
}