const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = require('../config/keys'); 

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
   
    passport.use(new JwtStrategy(options, ( jwt_payload, done ) => {

      
        User.findById( jwt_payload.id )
          
            .then( user => {
                if( user ){
                    //return the user to frontend
                    
                    return done( null, user );
                }else{
                
                     return done( null , false );
                }

            }).catch( err => done( err,null ));
    }));
};