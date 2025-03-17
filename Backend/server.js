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

// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Configuration
// dotenv.config({path:"../.env"});
// const app = express();
// const PORT = process.env.PORT || 3010;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connection à MongoDB
// const MONGO_URI = `${process.env.URL_MONGOOSE}/userdb` || 'mongodb://mongo:27017/userdb';
// mongoose.connect(`${process.env.URL_MONGOOSE}/${process.env.DB_NAME}`)
// .then(()=> console.log(`Connected to ${process.env.DB_NAME}`))
// .catch(err=> console.log(`Error Connecting: ${err}`));

// // Modèle d'utilisateur
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   age: { type: Number },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// // Routes
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // GET tous les utilisateurs
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET un utilisateur par son ID
// app.get('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // POST créer un nouvel utilisateur
// app.post('/users', async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     age: req.body.age
//   });

//   try {
//     const newUser = await user.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // DELETE supprimer un utilisateur
// app.delete('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
//     res.json({ message: 'Utilisateur supprimé' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Démarrer le serveur
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });