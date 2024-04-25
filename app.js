const express = require('express');
const app = express();
const path = require ('path');
const mongoose = require('mongoose');
const ejsMate = require ('ejs-mate');
const joi = require ('joi');
const session = require('express-session');
const flash = require ('connect-flash');
const ExpressError = require ('./utils/ExpressError');
const methodOverride = require("method-override");
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');

main().catch(err => console.log(err.message));
async function main() {
await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

app.engine('ejs',  ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static( path.join(__dirname, 'public')))

const sessionConfig = { 
    secret : 'thisShouldBeABetterSeret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use(passport.initialize());
app.use(passport.session);
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/fakeUser', async (req, res) =>{
        const user = new User({email:'Kutty@gmail.com', username: 'Kutty'});
        const newUser = await User.register(user, 'chicken');
        res.send(newUser);
    });


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res)=>{
    res.render('home')
});

app.all('*', (req, res, next) =>{
     // res.send('404!!!')
    next(new ExpressError('page not foud', 404))
})
 
app.use((err, req, res, next)=>{
    // res.send('somthing went wrog')
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Somthing Went Wrong';
    res.status(statusCode).render('error', { err });
    // const message = 'Invalid';
    // res.render('error', { message});
});

app.listen(2000, ()=>{
    console.log('Serving on port 2000!!!')
});