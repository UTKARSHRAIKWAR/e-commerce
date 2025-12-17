import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

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

app.get("/",(req,res)=>{
    res.json("Working")
})

app.listen(5000, ()=> 
    console.log("API Gateway running on PORT 5000")
);