const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req,res,next)=>{
    const token = req.headers['authorization']?.spit(' ')[1]
    if(!token) return res.status(403).send('Token no proporcionado');

    jwt.verify(token,SECRET_KEY,(err,decoded)=>{
        if (err) return res.status(401).send('Token invalido');
        req.userId = decoded.id;
        next();
    });

};
module.export = authMiddleware;