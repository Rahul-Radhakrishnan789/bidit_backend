const express=require('express')
const mongoose=require('mongoose')
const app=express()
const morgan = require("morgan")
const path = require('path')
const port = 5000
const cors=require("cors")
const dotenv=require ("dotenv")


dotenv.config()

const corsOptions = {
    origin: 'http://localhost:5173', 
  };

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOptions))
app.use(morgan("dev"))


main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(process.env.mongoDBurl);
  console.log("db connected");
}



const userRouter=require("./routes/userRoutes")
app.use(userRouter)






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })