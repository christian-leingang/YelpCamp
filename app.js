const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const method_override = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('DB connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(method_override('_method'));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong';
  res.status(statuscode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
