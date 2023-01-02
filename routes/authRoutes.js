//Seperate file for auth routes
const { Router } = require('express');
const authController = require('../controllers/authController');

//Creating new instance of router attaching diff requests to the router
const router = Router();

//Send back different view for the pages; post does the authenticating work
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
//Exporting router to index.js
module.exports = router;