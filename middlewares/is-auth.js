const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    console.log('Request',req.body);
    const token = req.get('Authorization');
    if(!token) {
        // throw new Error('No authorization key').statusCode = 401;
        const error = new Error("User is not authorised!");
        error.statusCode = 401;
        throw error;
    }
    let decodedToken;
    try {
        decodedToken = token.split(' ')[1];
        decodedToken = jwt.verify(decodedToken,'supersecretsecretkey');
    } catch(error) {
        error.statusCode = 500;
        throw error;
    }

    if(!decodedToken) {
        throw new Error('Not authorised!!').statusCode = 401;
    }
    req.userId = decodedToken.userId;
    next();
}