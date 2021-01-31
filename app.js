var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use("/static", express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "jade");

app.get("/",(req,res)=>{
    console.log("Peticion");
    res.render("index");
});

app.listen(8080);