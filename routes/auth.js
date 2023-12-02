const express = require('express')
const passport = require('passport')
const router = express.Router()


//@desc auth with google
//@rout GET/auth/google
router.get('/google', passport.authenticate('google',{ scope: ['profile', 'email']}))

//@desc google auth callback
//@rout GET/auth/google/callback
router.get('/oauth2/google/callback', 
passport.authenticate('google', { failureRedirect: '/'}), (req, res)=> {
    res.redirect('/dashboard')
    },
    (err,req,res,next) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    );

//@desc Logout User
//@route /auth/logout
//Change: Passport 0.6 requires logout to the async
router.get('/logout', (req,res,next)=>{
    req.logout(function(err){
        if(err) {return next(err)}
        res.redirect('/')
    })
})
module.exports =router