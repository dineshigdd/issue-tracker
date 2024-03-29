const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const app = express();
const db = require('./config/keys').mongoURI;   
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const issues = require('./routes/api/issues');
const projects = require('./routes/api/projects');
const path = require("path");
const { getUserProjects , setUserProjects } = require('./util/userProjects')


const passport = require('passport');
const { doesNotMatch } = require('assert');
const { compareSync } = require('bcryptjs');
const { nextTick } = require('process');
app.use( passport.initialize());
require('./config/passport')(passport);




mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to mongoDB successfully"))
    .catch( err => console.log(err));



    app.use('/styles', express.static(process.cwd() + '/styles'));
    app.use('/util', express.static(process.cwd() + '/util'));
    // app.use(express.static('util'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(session({
      'secret':'343ji43j4n3jn4jk3n',
       resave: false,
      saveUninitialized: false,
      user:''
    }))
   
    app.use(cookieParser());

    // Path routing
    app.use("/api/users", users);
    app.use("/api/projects", projects);
    app.use("/api/issues", issues);

    // View engine
    app.set('view engine', 'pug')
    app.set("views", path.join(__dirname, "./views"));
    
    // app.get('*', function( req, res,next) {
    //       res.locals.user = req.user || null;
    //       console.log(res.locals.user)
    //       next();
    // })

    app.get('/',function (req, res) {
      res.render('index')
      // res.sendFile(process.cwd() + '/views/index.html');
    });


    app.get('/sign-in',function (req, res) {  
      res.render('login')
    })

    app.get('/sign-up',function (req, res) {  
      res.render('signup')
    })

    
    //Index page (static HTML)
  // app.get('/sign-in',function (req, res) {   
  //     if ( req.session.user == undefined)
  //           res.sendFile(process.cwd() + '/views/login.html'); 
  //     else  {
  //       setUserProjects(req.session.user);      
  //       var project = getUserProjects();            
  //       res.render("project", {  project: project} );
  //     }         
      
  // });

  
 
  // app.get('/project', function (req, res) {
  //   res.render('project', { title: 'Hey', message: 'Hello there!' })
  // })

//   app.route('/')
//     .get( (req, res) =>{
//   res.render('index.html');
  
// });

   
    //user log out to be tested later
    app.route('/signout')
    .get(( req, res ) => {
        req.session.destroy();
        res. redirect('/');
  });

 

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('/views'));
    app.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'views','index.html'));
    })
  }



// const port = process.env.PORT || 5000;
// app.listen( port, () => console.log(`server is running on port ${port}`));
module.exports = app;