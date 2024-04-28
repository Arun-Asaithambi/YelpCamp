const express = require('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const User = require('../models/user');
const { reviewSchema } = require('../schemas');
const passport = require ('passport');
const localStrategy = require('passport-local');
const bcrypt = require ('bcrypt')



// router.get('/register', (req, res) =>{
//     res.render('users/register');
// })

// router.post('/register', catchAsync(async (req, res)=>{
//     try {
//         const {username, email, password} = req.body;
//         const hash = await bcrypt.hash(password, 12);
//         const user = new User({email, username, password:hash});
//         // const registeredUser = await User.register(user, password);
//         await user.save();
//         req.session.user_id = user._id;
//         req.flash('success','welcome to yelp camp!!');
//         res.redirect('/campgrounds');
//     } catch(e) {
//         req.flash('error', e.message);
//         res.redirect('register')
//     }
// }));

router.get('/login', (req, res)=>{
    res.render('users/login')
})


passport.use(new localStrategy(function verify(username, password, cb) {
    User.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, user);
      });
    });
  }))

// router.post('/login',passport.Authenticator('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{
// router.post('/login', async(req, res)=>{
//     const {username, password} = req.body;
//     const user = await User.find({username});
//     const valid = await bcrypt.compare(password, user.password )
//     if(valid){
//         req.flash('sucess', 'welcome back' );
//         res.redirect('/campgrounds');
//     } else{
//         req.flash('error', "somthing was wrong in your password and username" );
//         res.redirect('/login')
//     }
// })

module.exports = router;
