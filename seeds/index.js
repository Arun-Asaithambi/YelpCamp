const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors}= require('./seedHelpers') 
const Campground = require('../models/campground');

main().catch(err => console.log(err.message));
async function main() {
await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0;i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const prices = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://unsplash.com/collections/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.Lorem, ipsum dolor sit amet consectetur adipisicing elit.' ,
            price: `${prices}`
        })
        await camp.save()
    }
//     const c = await new Campground({ title:'purple field'});
//     await c.save(); 
}

seedDB().then(()=>{
    mongoose.connection.close();
})