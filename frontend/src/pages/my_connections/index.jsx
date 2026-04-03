import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  acceptConnection,
  getMyConnectionsRequest,
  getConnectionRequest
} from "@/config/redux/action/authAction";

import { BASE_URL } from "@/config";
import styles from "./style.module.css";
import { useRouter } from "next/router";

export default function MyConnection() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getMyConnectionsRequest({ token }));
      dispatch(getConnectionRequest({ token }));
    }

  }, [dispatch]);

  const pendingRequests = authState.connectionRequest?.filter(
    (conn) => conn.status_accepted === null
  );

  const acceptedConnections = authState.connections?.filter(
    (conn) => conn.status_accepted === true
  );

  return (
    <UserLayout>
      <DashboardLayout>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>

          {/* CONNECTION REQUESTS */}

          <h2>Connection Requests</h2>

          {pendingRequests?.length === 0 && (
            <h3>No Connection Request pending</h3>
          )}

          {pendingRequests?.map((conn, index) => {

            return (

              <div
                key={index}
                className={styles.userCard}
                onClick={() =>
                  router.push(`/view_profile/${conn.userId?.username}`)
                }
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    justifyContent: "space-between",
                  }}
                >

                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>

                    <div className={styles.profilePicture}>
                      <img
                        className={styles.imgCard}
                        src={`${BASE_URL}/uploads/${conn.userId?.profilePicture}`}
                        alt=""
                      />
                    </div>

                    <div className={styles.userInfo}>
                      <h1>{conn.userId?.name}</h1>
                      <p>{conn.userId?.username}</p>
                    </div>

                  </div>

                  <button
                    onClick={async (e) => {

                      e.stopPropagation();

                      await dispatch(
                        acceptConnection({
                          requestId: conn._id,
                          token: localStorage.getItem("token"),
                          action: "accept",
                        })
                      );

                    }}
                    className={styles.connectedButton}
                  >
                    Accept
                  </button>

                </div>

              </div>

            );

          })}

          {/* MY NETWORK */}
<h3>My Network</h3>

{acceptedConnections?.length === 0 && (
  <h3>No Connections Yet</h3>
)}

{acceptedConnections?.map((conn,index)=>{

const currentUserId = authState?.user?.id

const user =
conn.userId?._id === currentUserId
? conn.connectionId
: conn.userId

return(

<div
key={index}
className={styles.userCard}
onClick={()=>router.push(`/view_profile/${user?.username}`)}
>

<div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>

<div className={styles.profilePicture}>
<img
className={styles.imgCard}
src={`${BASE_URL}/uploads/${user?.profilePicture}`}
/>
</div>

<div className={styles.userInfo}>
<h1>{user?.name}</h1>
<p>{user?.username}</p>
</div>

</div>

</div>

)

})}
       
        </div>

      </DashboardLayout>
    </UserLayout>
  );
}