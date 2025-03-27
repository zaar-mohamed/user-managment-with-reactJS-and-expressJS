const express=require("express");
const app=express();

const cors = require('cors');
app.use(cors());
app.use(express.json());
require("dotenv").config({path:"../.env"})


const mongoose = require("mongoose");

mongoose.connect(`${process.env.URL_MONGOOSE}/${process.env.DB_NAME}`)
.then(()=> console.log(`Connected to ${process.env.DB_NAME}`))
.catch(err=> console.log(`Error Connecting: ${err}`));

const userModel=new mongoose.Schema({
    name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now }
});
const users= mongoose.model("users",userModel);

const router=express.Router();  
app.use("/",router);
router.get("/users",async(req,res)=>{
    try{
        const allUsers=await users.find({});
        res.status(200).json(allUsers)
    }
    catch(err){
        res.status(500).send(err.message)
    }

});
router.post("/users",async(req,res)=>{
    try{
        const newuser=await users.insertMany(req.body);
        // await newuser.save();
        res.status(201).json(newuser)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
router.get("/users/:id",async(req,res)=>{
    try{
        const userId=req.params.id;
        const user=await users.findOne({_id:userId});
        if(user){
            return res.status(200).json(user)
        }
        else{
            res.status(404).send("user not found")
        }

    }
    catch(err){
        res.status(500).json({error:err.message})
    }
    
});

router.delete("/users/:id",async(req,res)=>{
    try{const deletedUser=await users.findOneAndDelete({_id:req.params.id});
    if(!deletedUser){
        return rer.status(404).send("User not found")
    }
    res.status(200).send("User deleted successfully")
}
catch(err){
    res.status(500).json({message:err.message});
}
});
// router.put("/update/:id",async(req,res)=>{
// })
const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Listening on Port ${port}`)
});