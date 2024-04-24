const express = require('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const User = require('../models/user');
const { reviewSchema } = require('../schemas');
const passport = require ('passport');
const bcrypt = require ('bcrypt')



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
})

// router.post('/login',passport.Authenticator('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{
router.post('/login', async(req, res)=>{
    const {username, password} = req.body;
    const user = await User.find({username});
    const valid = await bcrypt.compare(password, user.password )
    if(valid){
        req.flash('sucess', 'welcome back' );
        res.redirect('/campgrounds');
    } else{
        req.flash('error', "somthing was wrong in your password and username" );
        res.redirect('/login')
    }
})

module.exports = router;

// passport('local', {failureFlash: true, failureRedirect: '/login'})

// const { username, password } = req.body;
//     const foundUser = await User.findAndValidate(username, password);
//     if (foundUser) {
//         req.session.user_id = foundUser._id;
//         req.flash('sucess', 'welcome back' );
//         res.redirect('/campgrounds');
//     }
//     else{
//         res.redirect('/login')
//         req.flash('error', 'something wrong in your username & password' );
//     }