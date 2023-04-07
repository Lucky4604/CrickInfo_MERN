const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose')
const User=require('./models/user.js')
const bcrypt=require('bcryptjs')



const app=express();
const salt=bcrypt.genSaltSync(10);
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json())

mongoose.connect('mongodb://localhost:/cricinfo_db')
   
app.post('/register',async(req,res)=>{
    const {username,password}=req.body;
    try{

        const userDoc=await User.create({username,
            password:bcrypt.hashSync(password,salt),
        });
       
        res.json(userDoc);
    }catch(error){
        res.status(400).json(error)
    }
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user with the given username
      const user = await User.findOne({ username });
  
      // If the user doesn't exist, return an error
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Compare the user's inputted password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If the passwords don't match, return an error
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // If everything checks out, return a success message
      return res.json({ message: 'Login successful' });
    } catch (error) {
      res.status(400).json(error);
    }
  });
  


app.listen(4000);
