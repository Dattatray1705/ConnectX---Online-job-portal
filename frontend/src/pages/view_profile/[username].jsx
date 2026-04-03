import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import {
  getConnectionRequest,
  sendConnectionRequest,
  getMyConnectionsRequest
} from "@/config/redux/action/authAction";

import { getAllPosts } from "@/config/redux/action/postAction";

export default function ViewProfilePage({ userProfile }) {

  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");

  // 🚨 USER NOT FOUND SAFETY
  if (!userProfile) {
    return (
      <UserLayout>
        <DashboardLayout>
          <h1>User not found</h1>
        </DashboardLayout>
      </UserLayout>
    );
  }

  // fetch posts + connections
  const loadData = async () => {

    const token = localStorage.getItem("token");

    await dispatch(getAllPosts());
    await dispatch(getMyConnectionsRequest({ token }));
    await dispatch(getConnectionRequest({ token }));

  };

  useEffect(() => {
    loadData();
  }, []);

  // filter posts
  useEffect(() => {

    if (!postReducer?.posts || !router.query.username) return;

    const posts = postReducer.posts.filter(
      (post) => post?.userId?.username === router.query.username
    );

    setUserPosts(posts);

  }, [postReducer?.posts, router.query.username]);

  // connection status check
  useEffect(() => {

    const sentConnection = authState?.connections?.find(
      (c) => c?.connectionId?._id === userProfile?.userId?._id
    );

    const receivedConnection = authState?.connectionRequest?.find(
      (c) => c?.userId?._id === userProfile?.userId?._id
    );

    const connection = sentConnection || receivedConnection;

    if (!connection) {
      setConnectionStatus("none");
    } 
    else if (connection.status_accepted === null) {
      setConnectionStatus("pending");
    } 
    else if (connection.status_accepted === true) {
      setConnectionStatus("connected");
    }

  }, [
    authState.connections,
    authState.connectionRequest,
    userProfile?.userId?._id
  ]);

  // connect button
  const handleConnect = async () => {

    const token = localStorage.getItem("token");

    await dispatch(
      sendConnectionRequest({
        token,
        connectionId: userProfile.userId._id
      })
    );

    await dispatch(getMyConnectionsRequest({ token }));
    await dispatch(getConnectionRequest({ token }));

  };

  return (
<UserLayout>
<DashboardLayout>

<div className={styles.container}>

{/* COVER */}
<div className={styles.backDropContainer}>
<img
className={styles.backdrop}
src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture || "default.jpg"}`}
alt="profile"
/>
</div>

{/* PROFILE DETAILS */}

<div className={styles.profileContainer_details}>

<div className={styles.profileContainer_flex}>

<div style={{display:"flex",gap:"1rem"}}>
<h2>{userProfile?.userId?.name}</h2>
<p style={{color:"grey"}}>
@{userProfile?.userId?.username}
</p>
</div>

{/* CONNECT BUTTON */}

<div style={{display:"flex",gap:"1rem"}}>

{connectionStatus === "connected" && (
<button className={styles.connectedButton}>
Connected
</button>
)}

{connectionStatus === "pending" && (
<button className={styles.connectedButton}>
Pending
</button>
)}

{connectionStatus === "none" && (
<button
className={styles.connectBtn}
onClick={handleConnect}
>
Connect
</button>
)}

{/* DOWNLOAD PROFILE */}

<div
onClick={async () => {

const response = await clientServer.get(
`/api/users/user/download_profile?id=${userProfile.userId._id}`
);

window.open(
`${BASE_URL}/${response.data.message}`,
"_blank"
);

}}
>

<svg
style={{width:"1.2em",cursor:"pointer"}}
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
strokeWidth={1.5}
stroke="currentColor"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
/>
</svg>

</div>

</div>



</div>

{/* POSTS */}

<div style={{flex:"0.2rem"}}>
  <div className={styles.bioBox}
style={{
color:"black",
background:"snow",
border:"1px solid silver",
borderRadius:"10px",
padding:"8px",
flexDirection:"column",
margin:"10px"

}}
>
<b>{userProfile?.bio}</b>
</div>

<h2>Recent Activity</h2>

{userPosts.map((post)=>(
<div key={post._id} className={styles.postcard}>

<div className={styles.card}>

<div className={styles.card_profileConatiner}>

{post.media !== "" ? (
<img
src={`${BASE_URL}/uploads/${post.media}`}
alt="post"
/>
) : (
<div style={{width:"3.4rem",height:"3.4rem"}}/>
)}

</div>

<p>{post.body}</p>

</div>

</div>
))}

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
<p>{work.years}</p>
</div>
))}

</div>

</div>

{/* EDUCATION */}

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

</div>

</div>
</div>

</DashboardLayout>
</UserLayout>
  );
}

export async function getServerSideProps(context) {

  try {

    const request = await clientServer.get(
      "http://localhost:5000/api/users/get_User_Profile_And_User_Based_On_Username",
      {
        params:{
          username: context.query.username
        }
      }
    );

    return {
      props:{
        userProfile: request?.data?.profile || null
      }
    };

  } catch(error) {

    return {
      props:{
        userProfile:null
      }
    };

  }

}