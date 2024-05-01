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
        const user = new User({username, password});
        const registeredUser = await User.register(user, password);
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


passport.use(new localStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));



router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
  req.flash('success', 'welcome back');
  res.redirect('/campgrounds');
})

// router.post('/login',async(req, res) =>{
//   const { username, password } = req.body;
//   const finduser = await User.findOne({ username, password });
//   if(finduser){
//   req.flash('success', 'Welcome back!!') 
//   res.redirect('/campgrounds')
//   } 
//   else{
//     req.flash('error', 'somthing wrong in username or password');
//     res.redirect('login');
//   }
// });


module.exports = router;
