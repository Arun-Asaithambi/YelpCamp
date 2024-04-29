const express = require('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const User = require('../models/user');
const { reviewSchema } = require('../schemas');
const passport = require ('passport');
const localStrategy = require('passport-local');
const bcrypt = require ('bcrypt');




router.get('/register', (req, res) =>{
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res)=>{
    try {
        const {username, email, password} = req.body;
        const hash = await bcrypt.hash(password, 12);
        const user = new User({email, username, password:hash});
        // const registeredUser = await User.register(user, password);
        await user.save();
        req.session.user_id = user._id;
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


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req, res) =>{
  res.flash('success', 'Welcome back!!') 
  res.redirect('/campgrounds')
});


module.exports = router;
