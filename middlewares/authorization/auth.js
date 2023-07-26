const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers.js")





const getAccessToRoute = (req, res, next) => {
    console.log("Get Access to Route " + JWT_SECRET_KEY);
    if(!isTokenIncluded(req))
    {
        return next(
            new CustomError("You are not authorized to access this route.",401)
        )
    }
    const { JWT_SECRET_KEY } = process.env;
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) =>{
        if (err) {
            return next(err);
        }
        console.log(decoded);
        next();
    })

    next();
};

module.exports = {
    getAccessToRoute
};