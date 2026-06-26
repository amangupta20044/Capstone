import "dotenv/config"
import app from './src/app.js';



app.listen(3000,(req,res)=>{
    console.log("server is running onn port 3000");
    
})