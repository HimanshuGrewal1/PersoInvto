import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' blob:; script-src 'self' 'unsafe-inline' blob:;");
    next();
  });
  
dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is at :${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongo connection error",err);
})

app.use((req, res, next) => {
    console.log(`Request Path: ${req.path}`);
    next();
});


