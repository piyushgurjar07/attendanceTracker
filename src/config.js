const mongoose = require("mongoose");
const connect=mongoose.connect("mongodb+srv://mokshakoshti21:iahIgPzlwTR8P1ei@cluster0.el3hckv.mongodb.net/Login-tut");;
// Connect to MongoDB
//mongoose.connect("mongodb://localhost:27017/Login-tut");
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    // useCreateIndex: true, // Deprecated
    // Instead of useCreateIndex, use createIndexes
    // createIndexes: true // New option
connect.then(() => {
    console.log('Connected to MongoDB');
}).catch(() => {
    console.log('Error connecting to MongoDB');
});

// Creating a Schema
const LoginSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection =new mongoose.model("users",LoginSchema);

module.exports = collection;