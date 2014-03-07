var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var bcrypt = require('bcrypt'),

     SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

var Comment = new Schema({
    username : String,
    content  : String,
    created  : Date
});




mongoose.model( 'Comment', Comment );

//http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt

UserSchema.pre('save', function(next) {

    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });


});


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


mongoose.model( 'UserSchema', UserSchema );

//mongoose.connect( 'mongodb://peewee:adagio098@ds039487.mongolab.com:39487/peewee' );

mongoose.connect( 'mongodb://localhost/comment' );


var User = mongoose.model('UserSchema');

var test = new User({
  username:'Jianmin',
  password:'password123'

});


 User.findOne({ username: 'Jianmin' }, function(err, user) {
        if (err) throw err;

        console.log(user);
        // test a matching password
        user.comparePassword('password123', function(err, isMatch) {
            if (err) throw err;
            console.log('password123:', isMatch); // -> Password123: true
        });

        // test a failing password
        user.comparePassword('password1234', function(err, isMatch) {
            if (err) throw err;
            console.log('password1234:', isMatch); // -> 123Password: false
        });
    });


/***
test.save(function(err){

      if (err) throw err;

    // fetch user and test password verification
    User.findOne({ username: 'Jianmin' }, function(err, user) {
        if (err) throw err;

        console.log(user);
        // test a matching password
        user.comparePassword('password123', function(err, isMatch) {
            if (err) throw err;
            console.log('password123:', isMatch); // -> Password123: true
        });

        // test a failing password
        user.comparePassword('password1234', function(err, isMatch) {
            if (err) throw err;
            console.log('password1234:', isMatch); // -> 123Password: false
        });
    });

});

*****/







