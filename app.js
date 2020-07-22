const express = require('express');
const app = express();
const db = require('./config/keys').mongoURI;   
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const issues = require('./routes/api/issues');
const projects = require('./routes/api/projects');

const passport = require('passport');
app.use( passport.initialize());
require('./config/passport')(passport);


mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to mongoDB successfully"))
    .catch( err => console.log(err));


    // app.get('/test', async (req, res) => {
    //     res.json({ message: "pass!" })
    //   })

    // app.post("/api/issues/:project" , (req,res) => {
    //     res.send("posted an")
    // })
    
    // app.get('/issues/issue/:project', ( req, res) => res.json( req.params));
   
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
   
    app.use("/api/users", users);
    app.use("/api/projects", projects);
    app.use("/api/issues", issues);


    //user log out to be tested later
    app.route('/logout')
    .get(( req, res ) => {
       req.logout();
     res.redirect('/');
  });

// const port = process.env.PORT || 5000;
//app.listen( port, () => console.log(`server is running on port ${port}`));
module.exports = app;