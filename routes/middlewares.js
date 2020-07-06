// create a middleware that checks if a user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // if (req.user)
    if (req.isAuthenticated()) {
      // if user is logged in, proceed to the next function
      next();
    } else {
      // else if user is not logged in, redirect to /login
      res.redirect('/auth/login');
    }
  };
};
module.exports = {
  loginCheck
};