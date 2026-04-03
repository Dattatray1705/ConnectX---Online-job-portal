import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/config/redux/reducer/authReducer";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";

export default function NavBarComponent() {

  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const isAuthPage = router.pathname === "/" || router.pathname === "/login";
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getAboutUser());
    }

  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.navBar}>

        <h1 style={{color:"blue",fontSize:"2rem",fontWeight:"bold"}}>
          ConnectX
        </h1>

        <div className={styles.navBarOptionContainer}>

          {!isAuthPage && authState.profile && localStorage.getItem("token") && (
            <div>

                <img                 onClick={()=>router.push("/profile")}
      src={`${BASE_URL}/uploads/${authState?.profile?.userId?.profilePicture || "default.jpg"}`}
      alt="profile"
      style={{width:"50px",borderRadius:"50%",height:"50px"}}
    />

              <p
                style={{fontWeight:"bold",cursor:"pointer", color:"blue"}}
                onClick={()=>router.push("/profile")}
              >
                Profile
              </p>

              <p
                style={{fontWeight:"bold",cursor:"pointer"}}
                onClick={()=>{
                  localStorage.removeItem("token");
                  dispatch(logout());
                  router.replace("/login");
                }}
              >
                Logout
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}