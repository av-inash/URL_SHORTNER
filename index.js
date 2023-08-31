const express=require("express")
const urlRoute=require('./routes/url')
const {connectToMongoDB}=require('./connect')
const URL =require('./models/url')
const path=require("path")
const app=express()
const PORT=7001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>console.log("mongodb connected"));

app.set("view engine","ejs");
app.set("views",path.resolve(__dirname,"views"));

app.use(express.json())

app.get("/test",async(req,res)=>{
    const allUrls=await URL.find({})
    return res.render('home',{ urls: allUrls, })
})
app.use('/url',urlRoute)

app.get("/url/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
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