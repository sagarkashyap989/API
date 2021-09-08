//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const routers = require('./routers/routes');
const Schema = require("./schema/userSchema.js");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "123456",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://dbuser:dbuser@marketplace.siclh.mongodb.net/userDB?retryWrites=true&w=majority", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

  







Schema.userSchema.plugin(passportLocalMongoose);
Schema.userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", Schema.userSchema);
const Article = mongoose.model("Article", Schema.articleSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/success",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.use(routers)




// app.get("/", function(req, res){
// });



app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newArticle = new Article({
    username: req.body.username,
    custom: req.body.custom,
    number: req.body.number,
    // custom: req.body.custom,
    email: req.body.email,
    // custom: req.body.custom,
    date: req.body.date,
    account_type: req.body.account_type
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:Username")

.get(function(req, res){

  Article.findOne({username: req.params.Username}, function(err, foundArticle){
    console.log(req.params.Username);
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

// .put(function(req, res){

//   Article.update(
//     {username: req.params.username},
//     {overwrite: true},
//     function(err){
//       if(!err){
//         res.send("Successfully updated the selected article.");
//       }
//     }
//   );
// })

.patch(function(req, res){

  Article.update(
    {username: req.params.Username},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {username: req.params.Username},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
