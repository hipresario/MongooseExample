var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Comment = new Schema({
    username : String,
    content  : String,
    created  : Date
});
 
mongoose.model( 'Comment', Comment );
 
mongoose.connect( 'mongodb://peewee:adagio098@ds039487.mongolab.com:39487/peewee' );