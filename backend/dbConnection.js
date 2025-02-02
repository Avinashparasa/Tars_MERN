const mongoose = require('mongoose');
// database uri for mongodb connection
const mongooseURI = 'mongodb+srv://parasaavinash27:2QsE7hYjxZPhguIr@vegstore.68rly7f.mongodb.net/VegEcommerce?retryWrites=true&w=majority&appName=VegStore';

// mongodb connection
const dbConnect = async () => {
    try {
        mongoose.connect(mongooseURI);
        console.log("message: mongoose connected successfully !!");
    }
    catch (error) {
        console.error("message: ", error.message);
        process.exit(1);
    }
}

module.exports = dbConnect;