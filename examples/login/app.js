const express 			= require('express');
const path 				= require('path');
const logger 			= require('morgan');
const cookieParser 		= require('cookie-parser');
const bodyParser		= require('body-parser');
const passport 			= require('passport');
const DocuSignStrategy 	= require('passport-docusign').Strategy;
const STRATEGY_NAME     = 'docusign';

const app 			    = express();
const PORT              = 8675; // default port to listen

// Configure Express to use EJS
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

const config = require('config');

const CLIENT_ID 		= config.get('clientID');
const CLIENT_SECRET 	= config.get('clientSecret');
const REDIRECT_URL 	    = config.get('callbackURL');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete DocuSign profile is
//   serialized and deserialized.
passport.serializeUser( function(user, done) {
	done(null, user);
});

passport.deserializeUser( function(obj, done) {
	done(null, obj);
});

// Use DocuSign Strategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and 37signals
//   profile), and invoke a callback with a user object.
passport.use(new DocuSignStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's DocuSign profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the DocuSign account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// configure Express
app.use(logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/docusign
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in DocuSign authentication will involve
//   redirecting the user to DocuSign.  After authorization, DocuSign
//   will redirect the user back to this application at /auth/docusign/callback
app.get('/auth/docusign',
  passport.authenticate(STRATEGY_NAME, { scope: ['spring_read', 'spring_write'] }),
  function(req, res){
    // The request will be redirected to DocuSign for authentication, so this
    // function will not be called.
  });

// GET /act-integration-oauth
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/act-integration-oauth',
  passport.authenticate(STRATEGY_NAME, { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => {
    console.log('Server Started!');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
