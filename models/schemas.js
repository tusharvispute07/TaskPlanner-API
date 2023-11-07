import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

const itemSchema = new mongoose.Schema({
    name: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Users = mongoose.model("User", userSchema);
const Items = mongoose.model("Item", itemSchema);


export { Users, Items };