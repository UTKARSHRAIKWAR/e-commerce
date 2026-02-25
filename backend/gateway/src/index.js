import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import { authenticate } from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config();

const app = express()

app.use(cookieParser());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // when we use body parsing in gateway, request never reach to other services
app.use((req, res, next) => {
  console.log("GATEWAY HIT:", req.method, req.originalUrl);
  next();
});

app.use("/auth", createProxyMiddleware({
    target:"http://localhost:5001",
    changeOrigin:true,  
    timeout: 5000,
    proxyTimeout: 5000,
}));

app.use("/product",authenticate, createProxyMiddleware({
    target:"http://localhost:5002",
    changeOrigin:true,
    timeout:5000,
    proxyTimeout:5000
}))

app.use("/cart",authenticate, createProxyMiddleware({
    target:"http://localhost:5003",
    changeOrigin:true,
    timeout:5000,
    proxyTimeout:5000
    
}))

app.use("/order",authenticate, createProxyMiddleware({
    target:"http://localhost:5004",
    changeOrigin:true,
    timeout:5000,
    proxyTimeout:5000
    
}))

app.use("/payment",authenticate, createProxyMiddleware({
    target:"http://localhost:5005",
    changeOrigin:true,
    timeout:5000,
    proxyTimeout:5000
    
}))

app.get("/health",(req,res)=>{
    res.json("Working")
})


app.listen(5000, ()=> 
    console.log("API Gateway running on PORT 5000")
);