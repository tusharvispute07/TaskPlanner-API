import jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
import {Users} from "../models/schemas.js"
import mongoose from "mongoose";

async function authenticateCookie(req, res, next){
    if (!req.cookies || !req.cookies.authToken){
        return res.status(401).json({message:"Unauthorized"})
    }
    const decoded = jwt.verify(req.cookies.authToken, process.env.SECRET_KEY,)
    if (!decoded) return res.status(403).json({message: "Forbidden"})
    const id = new mongoose.Types.ObjectId(decoded.userId)

    const user = await Users.findOne({_id: id})
        if (!user){
            return res.status(403).json({message: "Forbidden"})
        }
        req.user = user
        next()
   
}   

export default authenticateCookie;