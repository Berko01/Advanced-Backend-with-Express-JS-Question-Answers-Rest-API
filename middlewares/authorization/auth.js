const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers.js")





const getAccessToRoute = (req, res, next) => {
    
    if(!isTokenIncluded(req))
    {
        return next(
            new CustomError("You are not authorized to access this route.",401)
        )
    }
    
    const accessToken = getAccessTokenFromHeader(req);
    const { JWT_SECRET_KEY } = process.env;
    console.log("Get Access to Route " + JWT_SECRET_KEY);
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) =>{
        if (err) {
            return new CustomError("You are not authorized to access this route.", 401);
        }
        req.user = {
            id : decoded.id,
            name: decoded.name
        }
        next();
    })

    next();
};

module.exports = {
    getAccessToRoute
};