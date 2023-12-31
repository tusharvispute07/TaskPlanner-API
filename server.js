import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import router from "./routes/routes.js"
import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
const corsOptions = {
    origin:  ['https://taskplanner-app.onrender.com', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200 
} 

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true})
.then(()=>console.log("DB connected"))
.catch(err => console.log(err))

app.use(cors(corsOptions))


app.use('/',router)

app.listen(port, ()=>{
    console.log('Server is running')
})


