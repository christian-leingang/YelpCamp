if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./de');
const { places, descriptors } = require('./seedHelper');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

console.log(process.env);

mongoose.connect(dbUrl, {
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
  try {
    await Campground.deleteMany({});
  } catch (e) {
    console.log(e);
  }
  for (let i = 0; i < 200; i++) {
    const random600de = Math.floor(Math.random() * 600);
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '6280f201f821dcffadab14fc',
      location: `${cities[random600de].city}, ${cities[random600de].admin_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      price,
      geometry: { type: 'Point', coordinates: [cities[random600de].lng, cities[random600de].lat] },
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
