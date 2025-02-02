const connectToMongo = require('./dbConnection');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// mongoDB connection
connectToMongo();

// create express app
const app = express();

// cors
app.use(cors())
// get port number from environment variable
const port = process.env.PORT;


// create routes
app.get('/',(req,res) => {
    res.send('Server is up and running !!');
});

// middleware for json data comunication between frontend and backend
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// import routes from routes folder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// starting the express server
app.listen(port, ()=> {
    console.log(`MyNotebok backend listening at http://localhost:${port}`);
});
