const mongoose = require('mongoose');
const express=require("express");
const path=require("path")
const bcrypt=require("bcrypt");
const app=express();
const collection = require("./config");
const exp = require("constants");
const { exists } = require("fs");
const { escape } = require("querystring");
const PORT=5000;

// convert data to json format
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(express.static("public"));
app.set("view engine", "ejs");
//app.set("views",tempate_path);
//hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/signup",(req,res)=>{
    res.render("signup");
});

// register user
app.post("/signup",async(req,res)=>{
    const data={
        name:req.body.username,
        password:req.body.password
    }

    // check if the user already exists
    const existingUser=await collection.findOne({name: data.name});
    if(existingUser)
    {
        res.send("User already exists");
    }
    else
    {
        // hash the password
        const saltRounds = 10;
        const hashedPassword=await bcrypt.hash(data.password, saltRounds);
        data.password=hashedPassword; //replace original password with hashed password
        const userdata= await collection.insertMany(data);
        console.log(userdata);
        res.redirect("/login");
    }
}); 

// user login
app.post("/login",async(req,res)=>{
    try{
        const name=req.body.username;
        const flag="admin";
        const check = await collection.findOne({name: req.body.username});
        if(!check)
        {
            res.send("user cannot be found");
            return res.redirect("/");
        }
        const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
        if(isPasswordMatch&&name==flag)
        {
            //console.log(name);
            return res.redirect("/admin_page");
        }
        else if(isPasswordMatch)
        {
            return res.redirect("/home");
        }
        else
        {
          res.send("wrong password");
        }
    }catch{
        //alert("wrong Details");
        //res.alert("wrong Details");
        res.redirect("login")
    }
});






// Define a Mongoose schema
const year_dataSchema = new mongoose.Schema({
    // Define the structure of your data fields
    Degree: String,
    Branch: String,
    Year: Number,
  });
  
  // Create a Mongoose model based on the schema
  const year_DataModel = mongoose.model('Data', year_dataSchema, 'Year_class_to_studentname_db');
  
  // Connect to MongoDB
  mongoose.connect('mongodb+srv://mokshakoshti21:iahIgPzlwTR8P1ei@cluster0.el3hckv.mongodb.net/Login-tut', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Query the database to retrieve the data
    return year_DataModel.find({}).exec(); // Using the .exec() method to return a promise
  })
  .then((data) => {
    // Log the retrieved data to the console
    //console.log('Retrieved data:', data);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
  


app.get('/home', async (req, res) => {
    try {
      const branch_year_data = await year_DataModel.find(); // Retrieve all teachers from the database
      res.render('home', { branch_year_data }); // Render the page.ejs template with the retrieved data
    } catch (err) {
      console.error('Error retrieving teachers', err);
      res.status(500).send('Internal Server Error');
    }
});




// Define a Mongoose schema
const attendance_dataSchema = new mongoose.Schema({
    // Define the structure of your data fields
    Name: String,
    Enrollment: String,
    Percentage: Number,
    total:Number,
    Per:Number,
    // Add more fields as needed
  });
  
  // Create a Mongoose model based on the schema
  const attendance_DataModel = mongoose.model('attendance_Data', attendance_dataSchema, 'BTech_IT_2025');
  
  // Connect to MongoDB
  mongoose.connect('mongodb+srv://mokshakoshti21:iahIgPzlwTR8P1ei@cluster0.el3hckv.mongodb.net/Login-tut', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Query the database to retrieve the data
    return attendance_DataModel.find({}).exec(); // Using the .exec() method to return a promise
  })
  .then((data) => {
    // Log the retrieved data to the console
    //console.log('Retrieved data:', data);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
  
  
  app.post('/logAttendance', async (req, res) => {
    const { absentStudentIds } = req.body;
    try {
      // Update attendance percentage for absent students
      //console.log('Absent Student IDs:', absentStudentIds);
      await attendance_DataModel.updateMany({ _id: { $in: absentStudentIds } }, { $inc: { Percentage: 1 } });
      await attendance_DataModel.updateMany({}, { $inc: { total: 1 } });
      await attendance_DataModel.updateMany({ Percentage: { $gt: 0 } }, [
        {
          $set: {
            Per: {
              $multiply: [{ $divide: ["$Percentage","$total"] }, 100]
            }
          }
        }
      ]);
      //console.log('app.js pe aagaya');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error logging attendance:', error);
      res.sendStatus(500);
    }
  });
  
  // Serve the HTML file
  app.get('/page', async (req, res) => {
    try {
      const teachers = await attendance_DataModel.find(); // Retrieve all teachers from the database
      res.render('page', { teachers }); // Render the page.ejs template with the retrieved data
    } catch (err) {
      console.error('Error retrieving teachers', err);
      res.status(500).send('Internal Server Error');
    }
  });

// Add this route to fetch percentage based on enrollment number
app.get('/fetchPercentage', async (req, res) => {
  try {
      const enrollmentNo = req.query.enrollmentNo; // Get enrollment number from query parameter

      // Query the database to find the student with the given enrollment number
      const student = await attendance_DataModel.findOne({ Enrollment: enrollmentNo });
      if (!student) {
          return res.status(404).json({ error: 'Student not found' });
      }

      // Return the percentage for the student
      res.json({ percentage: student.Per });
  } catch (error) {
      console.error('Error fetching percentage:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get("/admin_page",(req,res)=>
{
    res.render("admin_page");
})
app.get("/page",(req,res)=>{
    res.render("page");
})
app.get("/index",(req,res)=>
{
  res.render("index");
})
app.get("/Student_home",(req,res)=>{
  res.render("student_home");
})
app.listen(5000,()=>
{
    console.log('server is running at port 5000');
})