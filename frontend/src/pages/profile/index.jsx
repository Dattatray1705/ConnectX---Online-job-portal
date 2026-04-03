import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
// import { resetPostId } from "@/config/redux/action/postAction";

export default function ProfilePage() {

  const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
      const dispatch = useDispatch();
        const authState = useSelector((state) => state.auth);
const posts = useSelector((state) => state.posts.posts || []);
const [userProfile,setUserProfile] = useState({
  userId:{
    name:"",
    username:"",
    email:"",
    profilePicture:""
  },
  bio:"",
  pastWork:[]
})
const [userPosts,setUserPosts] = useState([]);
const[isModalOpen ,setIsModalOpen] = useState(false);
const [inputData,setInputData] =useState({company:'',position:'',years:''})
const [isPostModalOpen,setIsPostModalOpen] = useState(false);
const [postInput,setPostInput] = useState({body:"",file:null});
const [isEducationModalOpen,setIsEducationModalOpen] = useState(false);
const [educationInput,setEducationInput] = useState({
  school:"",
  degree:"",
  fieldOfStudy:""
});
const handleWorkInputChange = (e)=>{
const{name ,value}=e.target;
setInputData({...inputData,[name]:value});
}

const handlePostChange = (e)=>{
 const {name,value} = e.target;
 setPostInput({...postInput,[name]:value});
};
const handleFileChange = (e)=>{
 setPostInput({...postInput,file:e.target.files[0]});
};
const handleEducationInputChange = (e)=>{
  const {name,value} = e.target;

  setEducationInput({
    ...educationInput,
    [name]:value
  });
};

const addPostToProfile = async () => {

  const formData = new FormData();

  formData.append("body", postInput.body);

  if (postInput.file) {
    formData.append("media", postInput.file);
  }

  try {

    await clientServer.post(
      "/api/posts/create_post",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    dispatch(getAllPosts());

    setPostInput({ body: "", file: null });
    setIsPostModalOpen(false);

  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {

  if (!posts?.length || !authState?.profile?.userId?._id) return;

  const userId = authState.profile.userId._id;

  const filteredPosts = posts.filter(
    (post) => post?.userId?._id?.toString() === userId?.toString()
  );

  setUserPosts(filteredPosts);

}, [posts, authState?.profile]);


useEffect(()=>{
dispatch(getAboutUser())
dispatch(getAllPosts())
},[dispatch])



useEffect(()=>{
if(authState?.profile){



setUserProfile(authState.profile)
}

},[authState.profile])


 const uploadProfilePicture = async(file)=>{
  const formData = new FormData();
  formData.append("profile_picture",file);
  formData.append("token",localStorage.getItem("token"));

  const responce = await clientServer.post("/api/users/update_profile_picture",formData,{
    headers:{
      "Content-Type":'multipart/form-data',
    },
  });
  dispatch(getAboutUser({token:localStorage.getItem("token")}));
 }

 
const updateProfileData = async()=>{
   const responce1 = await clientServer.post("/api/users/user_update",{
    token:localStorage.getItem("token"),
    name:userProfile?.userId?.name,
   });
 const responce2 = await clientServer.post("/api/users/update_profile_data",{
     token:localStorage.getItem("token"),
     bio: userProfile?.bio,
     currentPost:userProfile?.currentPost,
     pastWork:userProfile?.pastWork,
     education:userProfile?.education
 });
 dispatch(getAboutUser({token:localStorage.getItem("token")}));
}





  return (
    <UserLayout>
        <DashboardLayout>
            {authState.profile && (
      <div className={styles.container}>

{/* COVER */}
<div className={styles.backDropContainer}>

  <label htmlFor="uploadProfilePicture" className={styles.overlay}> 
    <p>Edit</p> 
    </label>
    <input onChange={(e)=>{
      uploadProfilePicture(e.target.files[0])
    }} hidden type="file" id="uploadProfilePicture" />
    <img
      src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture || "default.jpg"}`}
      alt="profile"
    />


</div>

{/* PROFILE DETAILS */}

<div className={styles.profileContainer_details}>

<div style={{ display:'flex',gap:"0.7rem" }}>
<div style={{flex:"0.8"}}>
<div style={{display:"flex",gap:"1rem",width:"fit-content",alignItems:"center"}}>
<input
  type="text"
  className={styles.nameEdit}
  value={userProfile?.userId?.name}
  onChange={(e) => {
    setIsEditing(true);
    setUserProfile({
      ...userProfile,
      userId: {
        ...userProfile.userId,
        name: e.target.value,
      },
    });
  }}
/>
<p style={{color:"grey"}}>
@{userProfile?.userId?.username}
</p>
</div>

<div >
<b>Bio:</b>

<textarea
  type="text"
  className={styles.bioEdit}
  value={userProfile?.bio}
  onChange={(e) => {
    setIsEditing(true);
    setUserProfile({
     
        ...userProfile, bio:
        e.target.value,
      
    });
  }}
  rows={Math.max(3,Math.ceil(userProfile.bio.length/80))}  // adjust as needed.
  style={{width:"100%"}}
/>
</div>

</div>
</div>
{/* POSTS */}

{/* RECENT ACTIVITY */}

<div className={styles.workHistory}>

<h4>Recent Activity</h4>

<div className={styles.workHistoryConatainer}>

{userPosts?.map((post,index)=>(
<div key={index} className={styles.workHistoryCard}>

{post.media && (
<img
src={`${BASE_URL}/uploads/${post.media}`}
alt="post"
style={{width:"100%",marginBottom:"10px"}}
/>
)}

<p>{post.body}</p>

</div>
))}

<button
className={styles.addWorkButton}
onClick={()=>setIsPostModalOpen(true)}
>
Add Post
</button>

</div>

</div>

</div>

{/* WORK HISTORY */}

<div className={styles.workHistory}>

<h4>Work History</h4>

<div className={styles.workHistoryConatainer}>

{userProfile?.pastWork?.map((work,index)=>(
<div key={index} className={styles.workHistoryCard}>
<p style={{fontWeight:"bold"}}>
{work.company} - {work.position}
</p>
<p><b>Experience :</b> {work.years}</p>
</div>
))}
<button className={styles.addWorkButton} onClick={()=>{
setIsModalOpen(true)
}}>Add Work</button>
</div>

</div>
<div className={styles.workHistory}>

<h4>Education</h4>

<div className={styles.workHistoryConatainer}>

{userProfile?.education?.map((edu,index)=>(
<div key={index} className={styles.workHistoryCard}>

<p style={{fontWeight:"bold"}}>
{edu.school}
</p>

<p>{edu.degree}</p>

<p>{edu.fieldOfStudy}</p>

</div>
))}

<button
className={styles.addWorkButton}
onClick={()=>setIsEducationModalOpen(true)}
>
Add Education
</button>

</div>

</div>
{isEditing && (
  <div onClick={()=>{
   updateProfileData();
  }} className={styles.upadateNameButton}>
    Update Profile
  </div>
)}
 {isModalOpen && (
  <div onClick={()=>{
    setIsModalOpen(false)
  }}
  
  
  className={styles.commentsContainer}>
    <div  onClick={(e)=>{e.stopPropagation()}}className={styles.allCommentsContainer}>
        <input
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
                onChange={handleWorkInputChange}
                name="position"
              />
                <input
                className={styles.inputField}
                type="text"
                placeholder="Enter  Company"
                onChange={handleWorkInputChange}
                name='company'
              />
                <input
                className={styles.inputField}
                type="number"
                placeholder="Years"
                onChange={handleWorkInputChange}
                name="years"
              />
        <div onClick={()=>{
  setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
  setIsModalOpen(false)
        }} className={styles.upadateNameButton}>Add Work</div>
    </div>

</div>
)}
{isPostModalOpen && (
<div
onClick={()=>setIsPostModalOpen(false)}
className={styles.commentsContainer}
>

<div
onClick={(e)=>e.stopPropagation()}
className={styles.allCommentsContainer}
>

<input
className={styles.inputField}
type="text"
placeholder="Write your post"
name="body"
value={postInput.body}
onChange={handlePostChange}
/>

<input
type="file"
onChange={handleFileChange}
/>

<div
onClick={addPostToProfile}
className={styles.upadateNameButton}
>
Add Post
</div>

</div>

</div>
)}
{isEducationModalOpen && (
<div
onClick={()=>setIsEducationModalOpen(false)}
className={styles.commentsContainer}
>

<div
onClick={(e)=>e.stopPropagation()}
className={styles.allCommentsContainer}
>

<input
className={styles.inputField}
type="text"
placeholder="School / College"
name="school"
onChange={handleEducationInputChange}
/>

<input
className={styles.inputField}
type="text"
placeholder="Degree"
name="degree"
onChange={handleEducationInputChange}
/>

<input
className={styles.inputField}
type="text"
placeholder="Field Of Study"
name="fieldOfStudy"
onChange={handleEducationInputChange}
/>

<div
onClick={()=>{

const updatedEducation = [...userProfile.education, educationInput];

setUserProfile({
  ...userProfile,
  education: updatedEducation
});

clientServer.post("/api/users/update_profile_data",{
  token: localStorage.getItem("token"),
  bio: userProfile?.bio,
  currentPost: userProfile?.currentPost,
  pastWork: userProfile?.pastWork,
  education: updatedEducation
});

dispatch(getAboutUser());

setIsEducationModalOpen(false);

}}

className={styles.upadateNameButton}
>
Add Education
</div>

</div>

</div>
)}
   </div>       


            )}
</DashboardLayout>
</UserLayout>
)
}


