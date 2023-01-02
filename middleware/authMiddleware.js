//Middleware for protecting routes in between requests

const jwt = require('jsonwebtoken')
const User = require('../models/user')

//Checks auth status applied to any route that requires it
const requireAuth = (req, res, next) => {

    //Grab token from the cookies
    const token = req.cookies.jwt //What we called the cookie and stored it as

    //Check if we have the token
    if (token) {
        //Verify the token (token, secret (matches secret before))
        jwt.verify(token, 'jiashdfuodbiyasgudhoausbfiuaosfdabsfaosdbaiusfbajsuf', (err, decodedToken) => {
            //If there's an error the token is not valid and we need to redirect
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                //Log the decoded token
                console.log(decodedToken)
                //Carry on with handler function for correct view
                next()
            }
        })
    }
    else {
        //Redirect to login screen if not
        res.redirect('/login')
    }
}

//Check current user function
const checkUser = (req, res, next) => {
    //Get token from cookies
    const token = req.cookies.jwt

    if (token) {
        //Verify token if we have one
        
        //Verify the token (token, secret (matches secret before))
        jwt.verify(token, 'jiashdfuodbiyasgudhoausbfiuaosfdabsfaosdbaiusfbajsuf', async (err, decodedToken) => {
            //If there's an error the token is not valid and we need to redirect
            if (err) {
                console.log(err.message)
                res.locals.user = null //We don't have a user
                next() //Don't do anything if there's no user logged in
            } else {
                //Log the decoded token
                console.log(decodedToken)
                //Carry on with handler function for correct view
                
                //Get the user information that's logged in
                    //Find the user with their ID
                let user = await User.findById(decodedToken.id)
                //Inside views if we have a user we're passing it into the view in the header
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null //We don't have a user
        next()

    }
}

//Export the function
module.exports = { requireAuth, checkUser }
