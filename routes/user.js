const express = require('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const User = require('../models/user');
const passport = require ('passport');
const bcrypt = require ('bcrypt');
const localStrategy = require('passport-local');



router.get('/register', (req, res) =>{
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res)=>{
    try {
        const {username, email, password} = req.body;
        // const hash = await bcrypt.hash(password, 12);
        // const user = new User({email, username, password:hash});
        const user = new User({username, password});
        const registeredUser = await User.register(user, password);
        // await user.save();
        req.flash('success','welcome to yelp camp!!');
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}));


router.get('/login', (req, res)=>{
  res.render('users/login')
});


router.post('/login',async(req, res) =>{
  const { username, password } = req.body;
  const finduser = await User.findOne({ username, password });
  if(finduser){
  req.flash('success', 'Welcome back!!') 
  res.redirect('/campgrounds')
  } 
  else{
    req.flash('error', 'somthing wrong in username or password');
    res.redirect('login');
  }
});


module.exports = router;
