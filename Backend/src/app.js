// import express from "express"
// import cors from "cors"
// import cookieParser from "cookie-parser"

// const app=express()
// app.use(cors({
//     origin:process.env.CORS_ORIGIN||"*",
//     credentials:true
// }))

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "API is running..." });
// });


// app.use((req, res, next) => {
//     res.setHeader("Content-Security-Policy", 
//         "default-src 'self' blob:; " +
//         "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; " +
//         "script-src-elem 'self' 'unsafe-inline' blob:; " +
//         "connect-src 'self'; " +
//         "img-src 'self' data: blob:;"
//     );
//     next();
// });

  

// app.use(express.json({limit:"16kb"}))
// app.use(express.urlencoded({extended:true,
//     limit:"16kb"
// }))
// app.use(express.static("public"))
// app.use(cookieParser())

// import userRouter from './routers/Userroutes.js'
// console.log("Registering userRouter");
// app.use("/api",userRouter)

// // app.use("/api", (req, res) => {
// //     console.log("himans");
// //     res.send("API Route Hit"); // Optional response
// // });


// export { app }

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

// ✅ FIX: Proper CSP to allow blob, scripts, and inline execution
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self' blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; script-src-elem 'self' 'unsafe-inline' blob:;"
    );
    next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ FIX: Add a root route to prevent 404 on `/`
app.get('/', (req, res) => {
    res.send("Server is working!");
});

import userRouter from './routers/Userroutes.js';
app.use("/api/v1/users", userRouter);

import bookRouter from './routers/book.routes.js';
app.use("/api/v1/books", bookRouter);

import expenseRouter from './routers/expense.routes.js';
app.use("/api/v1/expenses", expenseRouter);

import animeRouter from './routers/anime.router.js';
app.use("/api/v1/animes", animeRouter);

export { app };
