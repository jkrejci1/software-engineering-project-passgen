//Import the user model
//.. goes out of current folder
const User = require('../models/user')
const jwt = require('jsonwebtoken') //Used to create json web tokens

//Functions
//Function to handle errors in try catch blocks
const handleErrors = (err) => {
    //Log the error for the message and the code
    console.log(err.message, err.code)

    //Create an errors object
    let errors = { email: '', password: '' }

    //Incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'that email is not registered'
    }

    //Incorrect email
    if (err.message === 'incorrect password') {
        errors.email = 'that password is incorrect'
    }

    //Hidden duplicate error code
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors
    }
    //Validation errors
    if (err.message.includes('user validation failed')) {
       //Destructures the error properties
        Object.values(err.errors).forEach(({properties}) => {
            //console.log(error.properties) //To view what property we have, set what we send back = to the error destruction
            //Access the errors passing strings in sqr brackets
            errors[properties.path] = properties.message

        }) //Get values of what's inside the object
    
    }
    //Now return the errors
    return errors
}

//Store the max age of cookie
const maxAge = 3 * 24 * 60 * 60 //Value of three days in seconds

//Function for creating the JWT web token
const createToken = (id) => {
    //id comes from the user object (_id property)
    //Sign the jwt to create {payload}, secret
    return jwt.sign({ id }, 'jiashdfuodbiyasgudhoausbfiuaosfdabsfaosdbaiusfbajsuf', {
        expiresIn: maxAge
    })
}

//This is what will render the authentication information
module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    //Properties given by the user in form
    const { email, password } = req.body //Destructures above to our own use

    //Now try and create a new user in db with properties
    try { //Need to create json web token here
        //Tries to create a new user and sends it to db
        //This is asyncronus
        const user = await User.create({ email, password })
        
        //Create the token right after a successful sign in
        const token = createToken(user._id)
        //Now place inside a cookie and send as part of response
        res.cookie('jwt', token, { maxAge: maxAge * 1000 })

        //Sends back json information of the user with an _id
        //Send the user id as a response to the front end
        res.status(201).json({ user: user._id }) //Send back as json to whoever sent the req
    }
    catch (err) { //We can use the information we got to let the user know what the exact error is
        const errors = handleErrors(err)
        //Send errors as json
        //This is what's sent back to the user trying to login
        res.status(400).json({ errors }) //Send the json of errors object
    }
}

module.exports.login_post = async (req, res) => {
    /*
    //console.log(req.body) //Shows the data sent in the console by whatever user (postman example)
    const { email, password } = req.body //Destructures above to our own use

    //Print the information to the console that we got from the body; goes in order to destrucutre as you can see
    console.log(email, password)
    res.send('user login')
    */

    //Take email and password and log them in
    const { email, password } = req.body

    try {
        //Try to log in the user using our statics.<login method>
        const user = await User.login(email, password)

        //Create JWT for the user if they logged in
        const token = createToken(user._id)
        //Now place inside a cookie and send as part of response
        res.cookie('jwt', token, { maxAge: maxAge * 1000 })
        
        res.status(200).json({user: user._id }) //Return user ID if successfully logged in
    } catch (err) {

        //Call handle errors 
        const errors = handleErrors(err)
        //Let the user know what errors are going on
        res.status(400).json({ errors })
    }
}


module.exports.logout_get = (req, res) => {
    //We need to now delete the JWT cookie for the current user 
    //Can't delete it so we will replace it with a blank cookie with a short expire
    res.cookie('jwt', '', { maxAge: 1 })

    //Redirect to home page when logged out
    res.redirect('/')
}