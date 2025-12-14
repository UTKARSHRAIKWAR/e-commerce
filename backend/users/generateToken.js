import jwt from "jsonwebtoken";

const generateAccessToken = (_id) =>{
    return jwt.sign({_id},
        process.env.JWT_AccessSecret,
        {expiresIn:"15m"}
    );
};

const generateRefreshToken = (_id) => {
    return jwt.sign(
        {_id},
        process.env.RefreshSecret,
        {expiresIn:"15d"}
    );
};

export {generateAccessToken , generateRefreshToken};    