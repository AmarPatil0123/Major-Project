if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./util/ExpressError.js")
const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

main().then(()=>{
    console.log("Connected");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

const store= MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
    secret:process.env.SECRET,

    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error in mongo Session URL",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httponly:true,
    }
}



app.use(session(sessionOptions));
app.use(flash()); //it should be place before routes and session is required to work flash messages as the msg is stored in session

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some error Ocuured"}=err; //500  and  Some error occured is default values 
    res.status(statusCode).render("./error.ejs", {err});
})

app.listen(8080,(req,res)=>{
    console.log("Listining on port 8080");
})  

