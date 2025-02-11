import jwt from "jsonwebtoken";

export default async function Auth(req, res, next) {
    try {
        const signature = req.cookies.signature;
        const tokenData = req.headers.authorization;
        const token = `${tokenData}.${signature}`;

        if(!token || !signature || !tokenData) {
            res.status(401).json({ message: "Token is not exist!" });
        }
    
        jwt.verify(token, process.env.JWT_SERCET_KEY, async (err, payload) => {
            if(err) {
                return res.status(403).json({ message: "Token is not valid!!!" });
            }

            req.sub = payload.sub;
    
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Authentication Failed"});
    }
}