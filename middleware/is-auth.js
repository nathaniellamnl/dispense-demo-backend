const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization'); //Authorization: Bearer djkfhgkjfd
    if(!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(" ")[1]; // Bearer fdhgdu
    if(!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;

    
    try {
       decodedToken = jwt.verify(token, 'supersecretkey');
    } catch (err) {
        console.log("err:" + err);
        req.isAuth = false;
        return next();
    }

    if (!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}