const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    console.log('Request',req.body);
    const token = req.get('Authorization');
    if(!token) {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = token.split(' ')[1];
        decodedToken = jwt.verify(decodedToken,'supersecretsecretkey');
    } catch(error) {
         req.isAuth = false;
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}