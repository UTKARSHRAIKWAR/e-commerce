import jwt from "jsonwebtoken"

export const authenticate = (req,res,next) => {
    const token = req.cookies?.accessToken;

    if(!token){
        return res.status(401).json({message:"Not authorized."})
    }

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_AccessSecret);

        // identity pass to services

        req.headers["x-user-id"] = decodedToken.id;
        req.headers["x-user-role"] = decodedToken.role;

        next();
    } catch (err){
        return res.status(401).json({message:"Token expired", error:err})
    }
}