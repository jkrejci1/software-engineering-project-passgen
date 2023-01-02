//Used for the model structure of the user
const req = require('express/lib/request')
const mongoose = require('mongoose')
const { isEmail } = require('validator') //For verifying emails
const bcrypt = require('bcrypt') //Required for hashing

//Create schema for what the data will look like in the database
const userSchema = new mongoose.Schema({
    email: {
        //What should the property looks like
        type: String, //Type of the data is string
        required: [true, 'Please enter an email'], //Needs to be given
        unique: true, //Can't sign up with an existing account
        lowercase: true, //Needs to be lowercase before saved
        //Use npm install validator for automatic 
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please give a password'],
        minlength: [6, 'Minimum password length is 6 characters'] //User password can't be less than 6 characters long
    },


    //Attempt 1 at adding list to schema THIS MIGHT WORK --> WORK IN PROGRESS
    savedPass: {
        type: [String],
        required: false
    }
    //Attempt 1 at adding list to schema THIS MIGHT WORK --> WORK IN PROGRESS

    
})


//Mongoose hooks

//Fire a function after a new user is saved to DB
//THIS IS NOT A POST REQUEST ITS WHAT HAPPENS AFTER SENDING TO DB; after save action is done this function will fire
userSchema.post('save', function(doc, next) {
    console.log('new user was created and saved', doc)
    next() //Needed for moving on to sending to the user
})

//Fire a function before a document is saved to the DB
//pre hook can be used to hash a password before it's sent to the DB!
userSchema.pre('save', async function(next) {
    //this refers to local instance of the user
    //console.log('user about to be created and saved', this)
    
    //Hash the users password before we send it to the DB using bcrypt
    const salt = await bcrypt.genSalt() //Used to attach to front of password
    this.password = await bcrypt.hash(this.password, salt) //Two args -> (passwordtohash, salt)
    
    //Password in DB will now be the hashed one!
    next()
})

//Static method to login a user statics.<any>
userSchema.statics.login = async function(email, password) {
    //Take email then look inside database for it and find doc 
    //this -> user model itself (findOne -> finds record)
    const user = await this.findOne({ email }) //See if we have a user with this email, if not it's undefined
    //check if it exists
    if (user) {
        //Now compare the passwords by comparing the hashed passwords
        //(passwordnothashed, userPassword)
        const auth = await bcrypt.compare(password, user.password)

        //if it passes then the passwords matched, log them in
        if (auth) {
            return user
        }
        //If passwords are incorrect
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}
//The model
//'user' singular of what we defined in our database collection
//Mongoose connects to this automatically when creating users
const User = mongoose.model('user', userSchema)

//Export the model so we can use it
module.exports = User
