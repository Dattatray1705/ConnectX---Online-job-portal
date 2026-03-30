import { Router } from "express";   
import { 
  login, 
  register, 
  uploadProfilePicture, 
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUser,
   downloadProfile,
   sendConnectionRequest,
   whatAreMyConnections,
   acceptConnectionRequest,
   getMyConnections ,
   getUserProfileAndUserBasedOnUsername,
 
  
} from "../controllers/user.controller.js";

import multer from "multer";

const router = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "uploads/");
  },
  filename:(req, file, cb)=> {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


router.post("/register", register);
router.post("/login", login);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);// New route for getting user and profile information
router.post("/update_profile_data", updateProfileData);
router.post( "/update_profile_picture",upload.single("profile_picture"),  uploadProfilePicture );
router.get ("/get_all_user", getAllUser);
router.get("/user/download_profile" , downloadProfile);
router.post("/user/send_connection_request", sendConnectionRequest);
router.get("/user/getConnectionRequest", whatAreMyConnections);
router.get("/user/getMyConnections", getMyConnections);
router.post("/user/acceptConnection_Request", acceptConnectionRequest);
router.get("/get_User_Profile_And_User_Based_On_Username",getUserProfileAndUserBasedOnUsername)


export default router;
