const express = require('express');
const authRouter = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthSchema = require('./auth.model');

authRouter.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role, mobileNo,date } = req.body;

    const user = await AuthSchema.findOne({ $or: [{ email: email }, { mobileNo: mobileNo }] });

    if (user) {
      return res.status(409).json({
        message: "User with this email address or mobile number is already registered",
      });
    } else {
      bcrypt.hash(req.body.password, 12, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const auth = new AuthSchema({
            _id: new mongoose.Types.ObjectId(),
            username: username,
            email: email,
            password: hash,
            role: role,
            mobileNo: mobileNo,
           
          });

          auth.save()
            .then((result) => {
                
              console.log(result);
              res.status(201).json({
                message: `${username} account ${email} is created successfully!`,
                username:username,
                email:email,
                password:password,
                role:role,
                mobileNo:mobileNo,
                date:date
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error: error,
              });
            });
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
});

authRouter.get("/", async (req, res) => {
    try{
        const users = await AuthSchema.find();
        res.status(200).json(users);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
   
})

authRouter.post("/login",async (req, res) => {
  const { email, password,username }=req.body;
  try{

      const user = await AuthSchema.findOne({email});
      if (!user) {
          return res.status(209).json({
              message:"this email address are does not exist in the database!"
          })
      }

      bcrypt.compare(password, user.password,(err,result)=>{
             if(err){
              return res.status(401).json({
                  message:"Authentication failed"
              })
             }
             if(result){
                  const token = jwt.sign(
                      {email:user.email, userId:user._id,role:user.role},
                      process.env.secret,
                      {expiresIn:"7 day"}
                  )
                  return res.status(200).json({
                      message:`Login successful for ${email}`,
                      token:token,
                      username:user.username,
                      username,
                  })
             }

             return res.status(401).json({
               message:`wrong password!`
             });

      })

  }catch(err){
          console.log(err)
        return res.status(500).json({
          err:"Error checking user credentials"
        })
  }
        
} )


// Get the current user from the token
authRouter.get('/user', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.secret);
    const user = await AuthSchema.findById(decoded.userId);
    console.log(decoded.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message:"Varified Successful",name: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});


module.exports = authRouter;
