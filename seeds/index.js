const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('DB connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '61939188758d9c3dc9e3c6de',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dwtonpdyy/image/upload/v1637402971/YelpCamp/f3dus99hqu0wvxbvgimo.jpg',
          filename: 'YelpCamp/f3dus99hqu0wvxbvgimo',
        },
        {
          url: 'https://res.cloudinary.com/dwtonpdyy/image/upload/v1637402973/YelpCamp/n4p039aayotesio8qe0s.jpg',
          filename: 'YelpCamp/n4p039aayotesio8qe0s',
        },
        {
          url: 'https://res.cloudinary.com/dwtonpdyy/image/upload/v1637402975/YelpCamp/h88y7vergrwe38bnlkiv.jpg',
          filename: 'YelpCamp/h88y7vergrwe38bnlkiv',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
