import jwt from "jsonwebtoken";

const generateAccessToken = (user) =>{
    return jwt.sign({id:user._id , role:user.role },
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