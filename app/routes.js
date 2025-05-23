module.exports = function (app, passport, db, axios) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        var userId = req.user._id
        db.collection('recipes').find({ userId: userId }).toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs', {
                user: req.user,
                recipes: result
            })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout(() => {
            console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // recipe board routes ===============================================================
    app.get('/recipes', isLoggedIn, function (req, res) {
        db.collection('recipes').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('recipes.ejs')
        })
    });
    app.put('/saverecipes', isLoggedIn, (req, res) => {
        var userId = req.user._id
        console.log(req.body)
        db.collection('recipes').save({ userId: userId, name: req.body.name, img: req.body.img, card: req.body.card}, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
        })
    })

    app.get('/saverecipes', isLoggedIn, function (req, res) {
        db.collection('recipes').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs')
        })
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash recipes
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash recipes
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
