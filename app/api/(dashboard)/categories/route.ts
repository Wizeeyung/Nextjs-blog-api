import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) =>{

  try{
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");

    if(!userId || !Types.ObjectId.isValid(userId)){
      return new NextResponse(JSON.stringify({message: "Invalid or missing Id"}),
    {status: 400});
    }

    await connect();

    const user = await User.findById(userId);
    if(!user){
      return new NextResponse(JSON.stringify({message: "User not found in the database"}),
    {status:400})
    }

    //if the userId been passed from clients equal to the one from the user in the database
    const categories = await Category.find({
      user: new Types.ObjectId(userId)
    });

    return new NextResponse(JSON.stringify(categories), {status:200});


  }catch (error: any){
    return new NextResponse("Error in fetching categories" + error.message, {status:500});

  }
}