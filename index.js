const express=require("express")
const path=require("path")
const cookieParser =require('cookie-parser')
const {connectToMongoDB}=require('./connect')
const {restrictToLoggedinUseronly,checkAuth}=require('./middleware/auth')
const URL =require('./models/url')

const urlRoute=require('./routes/url')
const staticRouter =require('./routes/staticRouter')
const userRoute=require('./routes/user')

const app=express()
const PORT=7001;

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>console.log("mongodb connected"));


app.use(express.json())
app.use(express.urlencoded({extended:false})) // form data ko pass krne k liye chahiye
app.use(cookieParser())



app.use('/url',restrictToLoggedinUseronly,urlRoute)
app.use('/user',userRoute)
app.use("/",checkAuth,staticRouter)

app.get("/url/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },{
        $push:{
        visitHistory:{
            timestamp:Date.now(),
        },
    },
}
);
    res.redirect(entry.redirectURL)
     
})

app.listen(PORT,()=>console.log("Seever is running at PORT 7001"))