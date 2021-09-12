const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
    username: String,
    password: String,
    googleId: String
  });
  
  const articleSchema = {
      username:   String  ,
        custom:   String  ,
        number:   Number  ,
        // custom: req.body.custom,
        email:   String  ,
        // custom: req.body.custom,
        date:   String  ,
        account_type:   String
    };


  
    module.exports = { userSchema, articleSchema};