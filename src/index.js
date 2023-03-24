require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connect = require('../db')
const authRouter= require("./Auth/auth.route")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({origin:true,credentials:true}));

app.use("/user",authRouter)

app.get('/',(req,res)=>res.send('hello world'));

app.listen(PORT, async() => {
    await connect()
    console.log(`Server listening on port : http://localhost:${PORT}`);
  });
  