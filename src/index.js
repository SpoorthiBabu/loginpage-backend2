const express = require("express")
const app=express()
const path = require("path")
const hbs = require("hbs")

const LogInCollection= require("./mongodb")
//module.exports= collection
//we have to require it in whatever we have exported it in mongodb.js that is "collection"

app.use(express.json())

app.use(express.urlencoded({ extended: false }))


const templatePath= path.join(__dirname,'../templates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
//app.set('views', views)
app.set('views', templatePath) //by default, it will check for the views folder
//this is to say that, you have to check templatePath instead of views folder
//it works fine if tou just rename templates to views

app.use(express.static(publicPath))


app.get("/signup", (req,res)=>{
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
// app.get("/home", (req,res)=>{
//     res.render("home")
// })
app.post("/signup", async (req,res)=>{

    const data={
        name:req.body.name,
        password:req.body.password
    }
    //data.save();

    //inorder to work with mongodb, we have to work with async await functions

    console.log(data.name)
    await LogInCollection.insertMany([data])

    // const checking = await LogInCollection.findOne({name:data.name})
    // //find() returns a cursor whereas findOne() returns a document

    // console.log(data)
    // console.log("value of checking is ", checking)
    // try{
    //     console.log("111")
    //     if (checking.name === req.body.name && checking.password===req.body.password) {
    //         console.log("22")
    //         res.send("user details already exists")
    //     }
    //     else{
    //         console.log("333")
    //         await LogInCollection.insertMany([data])
    //     }
    // }
    // catch{(err)=>{
    //     console.log("444")
    //     res.send("wrong inputs")
    // }}

    res.status(201).render("login", {
        naming: req.body.name
    })    

})
//async function cause we're working with mongodb

app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { name: `${req.body.password}+${req.body.name}` })
            //res.redirect("youtube.com");
        }

        else {
            res.send("incorrect password")
        }
    } 
    
    catch (err) {
        res.send("wrong details")
    }

})



app.listen(3002, ()=>{
    console.log("server has started on port 3006")
})