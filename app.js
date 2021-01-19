var express = require("express");

var app = express();

app.use("/static", express.static('public'));

app.set("view engine", "jade");

app.get("/",(req,res)=>{
    console.log("Peticion");
    res.render("index");
});

app.listen(8080);