import mongoose from 'mongoose'
import {DB_Name} from '../Constant.js'

const connectDB = async () =>{
  try{
    const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
    console.log(`\n MongoDB connected successfully, DB host : ${connect.connection.host}`);
  }catch(e){
    console.log("Mongodb Connection error", e);
    process.exit(1)
  }
}

export default connectDB;