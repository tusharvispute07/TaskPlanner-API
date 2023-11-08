import jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
import {Users} from "../models/schemas.js"
import mongoose from "mongoose";

async function authenticateJWT(req, res, next){
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')){
        return res.status(401).json({message:"Unauthorized"})
    }
    const token = authorizationHeader.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY,)
        if (!decoded) return res.status(403).json({message: "Forbidden"})
        const id = new mongoose.Types.ObjectId(decoded.userId)

        const user = await Users.findOne({_id: id})
        if (!user){
            return res.status(403).json({message: "Forbidden"})
        }
        req.user = user
        next()
    }catch(error){
        return res.status(401).json({message:'Unauthorizaed'})
    }
    
   
}   

export default authenticateJWT;