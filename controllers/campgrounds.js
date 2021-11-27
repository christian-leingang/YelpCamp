const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  let campgrounds = [];
  const searchterm = req.query.search;
  const options = { title: new RegExp(searchterm, 'i') };

  if (searchterm && !req.query.page) {
    campgrounds = await Campground.paginate(options, {});
    const nextPage = campgrounds.totalPages > campgrounds.page ? true : false;
    res.render('campgrounds/index', { campgrounds, searchterm, nextPage });
  } else if (searchterm) {
    const { page } = req.query;
    const campgrounds = await Campground.paginate(options, { page });
    res.status(200).json(campgrounds);
  } else {
    if (!req.query.page) {
      const campgrounds = await Campground.paginate({}, {});
      const nextPage = campgrounds.totalPages > campgrounds.page ? true : false;
      res.render('campgrounds/index', { campgrounds, nextPage });
    } else {
      const { page } = req.query;
      const campgrounds = await Campground.paginate({}, { page });
      res.status(200).json(campgrounds);
    }
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.author = req.user._id;
  console.log(campground);
  await campground.save();
  req.flash('success', 'Campground successfully created!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Sorry, cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Sorry, cannot edit that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', 'Campground successfully updated!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Campground successfully deleted!');
  res.redirect('/campgrounds');
};
