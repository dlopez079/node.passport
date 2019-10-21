//This is created for the routes that we want to protect with authentication.  

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } 
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');
    }
}