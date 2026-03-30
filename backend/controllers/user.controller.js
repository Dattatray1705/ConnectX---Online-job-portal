import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connection.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";

import { convertUserDataTOPDF } from "../utils/convertUserDataTOPDF.js";



export const register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { name, email, password, username } = req.body ;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = await User.create({
  email,
  password: hashedPassword,
  name,
  username
});


    // await newUser.save();

    const profile = new Profile({
      userId: newUser._id
    });

    await profile.save()

   return res.status(201).json({ message: "User created successfully" });

} catch (error) {
    return res.status(500).json({ message: error.message });
}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });     // store token in db

    // ✅ CORRECT RESPONSE
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const uploadProfilePicture = async (req ,res)=>{
  
      const{token}= req.body;

      try{
        const user = await User.findOne({token:token}); // Find user by token
        if(!user){
          return res.status(404).json({message:"User not found"});

        }

        user.profilePicture = req.file.filename;  // Update profile picture filename it gives from   upload.single("profile_picture").
        await user.save();
        
        return res.json({message:"Profile picture updated successfully"}); 

      }catch(error){
            return res.status(400).json({message: error.message});
      }
}


export const updateUserProfile = async (req, res) =>{
  try{
    const {token , ...newUserData} = req.body;   // spread operator
   const user = await User.findOne({token:token});
 if (!user){
  return res.status(404).json({message:"User not found"});
 }
 const {username , email} = newUserData; // 
 const existingUser = await User.findOne({$or:[{username},{email}]});// $or operator to check if either username or email already exists
 if(existingUser){
  if(String(existingUser._id)!== String(user._id)){  // cheack if existing user  is not the same as the current user
    return res.status(400).json({message:"User already exists "});
  }
 }

 Object.assign(user, newUserData); // Update user data with newUserdata
  await user.save();
 return res.json({message:"Profile updated successfuly"});
  }catch(error){
    return res.status(500).json({message: error.message});
  }
} 


export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("token:", token);

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name email username profilePicture");

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const updateProfileData = async (req, res) => {
  try {
  

    const { token, ...newProfileData } = req.body || {};

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const user = await User.findOne({ token:token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile, newProfileData);
    await profile.save();

    return res.json({ message: "Profile updated successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getAllUser = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("userId", "name username email profilePicture");

    // ✅ FILTER profiles with missing userId
    const users = profiles
      .filter((p) => p.userId) // 🔥 IMPORTANT
      .map((p) => ({
        _id: p.userId._id,
        name: p.userId.name,
        username: p.userId.username,
        email: p.userId.email,
        profilePicture: p.userId.profilePicture,
      }));

    return res.status(200).json(users);
  } catch (error) {
    console.error("getAllUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};

 



export const downloadProfile = async (req, res) => {
  try {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
      .populate("userId", "name email username profilePicture");

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const pdfFile = await convertUserDataTOPDF(userProfile);

    return res.json({
      message: `uploads/${pdfFile}`
    });

  } catch (error) {
    console.log("PDF ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

   const connectionRequest = new ConnectionRequest({
  userId: user._id,
  connectionId: connectionUser._id,
});

await connectionRequest.save();
return res.json({ message: "Request sent" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const requests = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name email profilePicture");

    return res.json({ requests });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const acceptConnectionRequest = async (req,res)=>{

const {token, requestId, action_type} = req.body

const user = await User.findOne({token})

if(!user){
return res.status(404).json({message:"User not found"})
}

const connection = await ConnectionRequest.findById(requestId)

if(!connection){
return res.status(404).json({message:"Request not found"})
}

connection.status_accepted = action_type === "accept"

await connection.save()

return res.json({message:"Request updated"})
}
export const getUserProfileAndUserBasedOnUsername = async (req ,res) =>
{
 const {username} = req.query;
 try{
  const user = await User.findOne({username});
  if(!user){
    return res.status(404).json({message:"user not found"})
  }
  const userProfile = await Profile.findOne({userId:user._id})
  .populate('userId','name username email profilePicture');
  return res.json({"profile":userProfile})
}catch(error){
   console.log("ERROR:", error);  
  return res.status(500).json({message:"get somthing wet wrong"})
}
}
