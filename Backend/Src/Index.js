import dotenv from 'dotenv'
import connectDB from './Database/Index.js'
import {app} from './App.js'

dotenv.config({
  path:'./.env'
})

const port = process.env.PORT || 3000

connectDB()
.then(()=>{
  app.listen(port,()=>{
    console.log('Server is running at port :', port)
  })
})
.catch((e)=>{
  console.log("MongoDb connection failed",e);
})