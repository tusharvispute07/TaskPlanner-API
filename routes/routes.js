import dotenv from "dotenv"
dotenv.config()
import express from "express";
import {Users, Items} from "../models/schemas.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import authenticateCookie from "../middleware/auth.js";

const router = express.Router()

router.get('/api', authenticateCookie, async (req, res)=>{
    const items = await Items.find({createdBy: req.user._id})
    if (items){
        res.json({items:items, user:req.user})
    } 
    else{
        res.status(404).json({message:"No items found"})
    }
})

router.get('/api/userExists/:username', async (req, res) => {
    const username  = req.params.username
    try {
      const user = await Users.findOne({ username:username })
      const exists = !!user
  
      res.json({ exists })
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).json({ error: 'Failed to check user existence' });
    }
  });
  

router.post('/api/register', async (req, res) => {
    try {
        const { fname, lname, username, email, password } = req.body
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = new Users({
            fname: fname,
            lname: lname,
            username: username,
            email: email,
            password: hashedPassword, 
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            res.status(200).json({message:"User registered successfully"})
        } else {
            res.status(500).json({ message: "Failed to register user." });
        }
    } catch (error) {
        console.log("Error registering user.", error);
        res.status(500).json({ message: "Failed to register user." });
    }
});

router.post('/api/login', async (req, res)=>{
    const {username, password} = req.body
    console.log(username, password)
    const user = await Users.findOne({username})

    if(!user) return res.status(401).json({message: "Invalid Credentials"})
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({message:"invalid Credentials"})
   
    const token = jwt.sign({userId: user._id.toString()}, process.env.SECRET_KEY)
    console.log("auth token", token)
    res.cookie('authToken', token, { domain: '.onrender.com', secure: true})
    res.status(200).json({message:"login successful"})
})

router.post('/api/add', authenticateCookie, async (req, res)=>{
    const newItem = new Items({name:req.body.name, createdBy:req.user._id})
    const savedItem = await newItem.save()
    if (savedItem){
        res.status(200).json({message: "Item added successfully!"})
    }else{
        res.send("Failed to save item")
    }
})

router.delete('/api/delete/:id', authenticateCookie, async (req, res)=>{
    const itemId = new mongoose.Types.ObjectId(req.params.id)
    const userId = req.user._id
    const items = await Items.findOneAndDelete({_id:itemId, createdBy:userId}).exec()
    if (!items){
        res.status(404).json({message: "Item not found"})
    }else{
        res.status(200).json({message: "Item deleted successfully"})
    }
    
})


export default router