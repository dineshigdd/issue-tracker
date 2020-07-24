const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const User = require('../../models/User');


// user log in
router.post("/login", async ( req, res ) =>{
  
     const { email , password } = req.body;

    User.findOne({ email })
        .then( user => {
                if( !user ) { return res.status(400).json("This user is not registered") }
                bcrypt.compare( password, user.password )
                    .then( isMatch => {
                        if(isMatch) { 
                           
                            const payload = { id: user.id, name: user.first_name };
                               jwt.sign( payload, keys.secretOrKey , { expiresIn: 7200 },
                                 ( err , token ) => {
                                    res.json({ success: true, token: 'Bearer ' + token , project: '/project'})
                                    //res.json({ success: true})
                                    // res.send({ project: '/project' })
                                    
                                    
                                   
                            })
                            
                        }else{
                            return res.status(400).json("Incorrect password");
                        }
                    })
        })            
})

 //user sign up
 router.post("/signup", async (req,res) => {
    //check an already a user exists
    User.findOne( { email: req.body.email})
        .then( user=> {
                if(user){
                    return res.status(400).json({ email: "the user already existed"})
                }else{
                    const user = new User({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: req.body.password,

                    });

                   
                    bcrypt.genSalt( 10, ( err, salt ) => {
                        bcrypt.hash( user.password, salt, ( err, hash ) =>{
                            if( err) throw err;
                            user.password = hash;
                            user.save()
                                .then( user => res.json( user))
                                .catch( err => console.log( err ))
                        })
                    })
                }
        })
 
})
//This route is not need for this app.
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,       
        email: req.user.email
      });
  })

  router.get("/project", (req, res) => {
    res.render("about", { title: "Hey", message: "Hello there!" });
  });




module.exports = router;