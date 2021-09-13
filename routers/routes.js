const express = require("express");
const passport = require("passport");
const Schema = require("./schema/userSchema.js");



userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);
const router = express.Router()


router.get("/", (req, res) =>{
  res.render("home");

})



router.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

router.get("/auth/google/success",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to success.
    res.redirect("/success");
  });

  router.get("/login", function(req, res){
  res.render("login");
});

router.get("/register", function(req, res){
  res.render("register");
});

router.get("/success", function(req, res){
  if (req.isAuthenticated()){
    res.render("success");
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

// app.get("/", function(req, res){

//     res.render("home");
//    });
   
   

    

router.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/success");
      });
    }
  });

});

router.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/success");
      });
    }
  });

});

module.exports = router;