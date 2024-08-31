import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import  { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () =>{

  try{
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users),{status:  200});
  } catch (error: any){
    return new NextResponse("Error in fetching users" + error.message, {status:500});
  }
  
}

export const POST = async(request: Request) => {

  try{
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(JSON.stringify({message: "User is created", user: newUser}), {status:200})

  }catch(error: any){
    return new NextResponse("Error in creating user" + error.message,{
      status:500,
    })

  }
}


//UPDATING USER
export const PATCH = async (request: Request) =>{
  try{
    const body = await request.json();
    const {userId, newUsername} = body;

    //Connect to database
    await connect();

    //if userId and new username is not present in the body which is the request then give a message of user not found
    if(!userId || !newUsername){
      return new NextResponse(JSON.stringify({message: "ID or new username not found"}),{
        status:400,
      })
    }

    //if userId is not found or not correct then throw a message of invalid userId
    if(!Types.ObjectId.isValid(userId)){
      return new NextResponse(JSON.stringify({message: "Invalid UserId"}),{
        status:400,
      })
    }

    //after all conditions abover her met, then create an updated user
    const updatedUser = await User.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {username: newUsername},
      {new: true}
    )

    //if you created an updated user and didnt work throw a new message
    if(!updatedUser){
      return new NextResponse(JSON.stringify({message: "User not found in the database"}),
    {status:400});
    }

    //if user was created successfully then throw a message of new user is updated.
    return new NextResponse(JSON.stringify({message: "User is updated", user:updatedUser}),{status:200})


  }catch(error:any){
    return new NextResponse("Error in updating user" + error.message, {
      status:500,
    }) 
  }
}



//DELETE USER
export const DELETE = async (request: Request) => {
  try{
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get("userId");

    if(!userId){
      return new NextResponse(JSON.stringify({message: "ID not found"}),
    {status:400})
    }

    if(!Types.ObjectId.isValid(userId)){
      return new NextResponse(JSON.stringify({message: 'Invalid user id'}),{
        status:400
      })
    }

    await connect();

    //After connecting to database if all the conditions above are  met then delete user by id.
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    //if it doesnt delete user then throw a message
    if(!deletedUser){
      return new NextResponse(JSON.stringify({message: "User not found in the database"}),
    {status: 400})
    }

    return new  NextResponse(
      JSON.stringify({message: "User is deleted", user: deletedUser}), {status: 200}
    )
  }catch(error: any){
    return new NextResponse("Error in deleting user" + error.message, {status: 500})
  }

 
}