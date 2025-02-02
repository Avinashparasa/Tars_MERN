const express = require('express');
const User = require('../models/Users');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// secret key for json web token
const jwt_secret = process.env.JWT_SECRET_KEY;

// create routes
const router = express.Router();

// ROUTE 1:
// create new user endpoint
router.post('/createuser',[
    // body data validation
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail().custom(async (value, { req }) => {
        // Check if email is from a valid domain (e.g., gmail.com)
        const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com']; // Add more valid domains if needed
        const domain = value.split('@')[1];
        if (!validDomains.includes(domain)) {
            throw new Error('Use a valid email domain');
        }
        // Check if email already exists
        let user = await User.findOne({ email: value });
        if (user) {
            throw new Error('Email already exists');
        }
        return true;
    }),
    body('password','Password must be atleast 8 characters').isLength({ min: 8 })
], async (req,res) => {
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: success, errors: errors.array() });
    }

    // if any error occurs
    try {
    // create new user
    // create salt using 'genSalt'
    const salt = await bcrypt.genSalt(10);
    // generate hash using user's password and salt
    const securePassword = await bcrypt.hash(req.body.password, salt);
    // pass the data to database to create new user
    let newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword
      })

    // create json web token
    const data = {
        user: {
            // get user id
            id: newUser.id
        }
    };
    // create auth token using json web token with secret key and data 
    const authToken = jwt.sign(data, jwt_secret);

    // send auth token in response
    // return success message
    success = true;
     res.status(201).json({success: success, message: 'User created successfully!!',authToken: authToken});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 2:
// login endpoint
router.post('/login',[
    body('email','email is invalid!').isEmail(),
    body('password','Enter a valid password').exists()
], async (req,res) => {
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: success, errors: errors.array() });
    }

    const {email,password} = req.body;
    // if any error occurs
    try {
    // find email alreay exists or not
    let loginUser = await User.findOne({email: email});

    // if email already exists
    if(!loginUser){
        return res.status(401).json({success: success, error: 'email or pasword is incorrect!!'});
    }

    // compare password with hashed password in database using 'compare' method
    let comparePassword = await bcrypt.compare(password, loginUser.password);

    // if password is incorrect
    if (!comparePassword) {
        return res.status(401).json({success: success, error: 'email or pasword is incorrect!!'});
    }

    // create json web token
    const data = {
        user: {
            // get user id
            id: loginUser.id
        }
    }
    // create auth token using json web token with secret key and data
    const authToken = jwt.sign(data,jwt_secret);

    // send auth token in response
    // return success message
    success = true;
     res.status(200).json({success: success, message: 'User login successfully!!', authToken: authToken});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3:
// get user data endpoint
router.post('/getuser',fetchuser, async (req,res) => {
    try {
        // get user id from middleware
        let userID = req.user.id;
        // select all fields except password
        const user = await User.findById(userID).select('-password');
        // send user data
        res.send(user);
    }
    catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4:
// delete user account along with all notes
router.delete('/deleteaccount', fetchuser, async (req, res) => {
    try {
      // Delete all notes of the authenticated user
      await Note.deleteMany({ user: req.user.id });
  
      // Delete the user account
      await User.findByIdAndDelete(req.user.id);
  
      res.status(200).send({ success: true, message: 'User account and all associated notes have been deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
  });


  // ROUTE 5:
// Update user password
router.put('/updatepassword', fetchuser, [
    // body data validation
    body('opassword', 'Enter your old password').exists(),
    body('npassword', 'New password must be at least 8 characters').isLength({ min: 8 }),
  ], async (req, res) => {
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, errors: errors.array() });
    }
  
    const { opassword, npassword } = req.body;
  
    try {
      // Fetch the user by ID
      let user = await User.findById(req.user.id);
  
      // Check if old password matches the stored hashed password
      const isMatch = await bcrypt.compare(opassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: success, error: 'Invalid old password' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(npassword, salt);
  
      // Update the user's password
      user.password = newPassword;
      await user.save();
  
      success = true;
      res.status(200).json({ success: success, message: 'Password updated successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });

  
  


module.exports = router;