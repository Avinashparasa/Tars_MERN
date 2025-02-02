const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
const jwt_secret = process.env.JWT_SECRET_KEY;

fetchuser = (req, res,next) => {
    // get the user from the jwt token and add id to req object

    // get token fron header 'auth-token'
    const token = req.header('auth-token');
    // if token is invalid
    if (!token){
        // if token is invalid
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }

    try {
        // verify received token
        const data = jwt.verify(token, jwt_secret);
        // add user id to req object 
        req.user = data.user;
        // call next middleware 
        next();
    }
    catch (error){
        // if token is invalid
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
}

module.exports = fetchuser;