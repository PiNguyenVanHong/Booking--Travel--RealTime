import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        res.status(401).json({ message: "Token is not exist!" });
    }

    jwt.verify(token, process.env.JWT_SERCET_KEY, async (err, payload) => {
        if(err) {
            return res.status(403).json({ message: "Token is not valid!!!" });
        }

        req.sub = payload.id;

        next();
    });
}