import express from "express";
import agentRouter from "./routes/agent.routes";
import morgan from "morgan";



const app = express()

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/status/healthz",(req,res)=>{
    res.status(200).json({status:"ok"});
})

// Routes
app.use("api/ai/",agentRouter)

export default app;