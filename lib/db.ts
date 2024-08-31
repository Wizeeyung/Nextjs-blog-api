import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


const connect = async () =>{
  //lets check if the database is connected, if its not then create a try catch block to connect
  const connectionState = mongoose.connection.readyState;

  if(connectionState === 1){
    console.log("Database is already connected");
    return;
  }

  if(connectionState === 2){
    console.log("Database is connecting...");
    return;
  }

  try{
    mongoose.connect(MONGODB_URI!, {
      dbName: 'nextjs14-mongodb-restapi',
      bufferCommands: true
    });
    console.log("Database is connected");
  }catch (err:any){
    console.log("Error: ", err);
    throw new Error("Error: ", err);
  }
}

export default connect;