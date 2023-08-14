var mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

var mongoString = process.env.MONGO_URI;

console.log('mongoString', mongoString);

const dbConfig = {

connect : function(){

    console.log("connecting to server....");
    mongoose.connect(mongoString, { useNewUrlParser: true,  useUnifiedTopology: true });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function() {
        console.log("DB connected successfully");
    });
}
};

export default dbConfig;