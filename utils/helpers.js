const User = require('../models/user')

// This function sets up the ability to allow a user to set the url for the email handler.
exports.setUrl = (request, route, params) => {
  return `${request.protocol}://${request.headers.host}/${route}/${params}`;
};

exports.checkIfNotVerified = async (req, res, next) => {
  let user = await User.findOne({ username: req.body.username });
    if (!user) return next();
    if (user && !user.isVerified) {
      req.flash("error", `Your account is not active. Check your email to verify your account`);
      return res.redirect("/campgrounds");
    }
    return next();
}
