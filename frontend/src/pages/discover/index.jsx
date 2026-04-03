import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import styles from "./style.module.css";
import { useRouter } from "next/router";

export default function Discoverpage() {
const [search, setSearch] = useState("");
  const authState = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  console.log(authState);          // 👈 इथे
  console.log(authState.allUsers); 
  useEffect(()=>{
    if(!authState.All_profiles_fetched){
      dispatch(getAllUsers());
    }
  },[dispatch, authState.All_profiles_fetched]);
  const filteredUsers = authState?.all_users?.filter((user) => {
  const searchText = search.trim().toLowerCase();

  return (
    user?.name?.toLowerCase().includes(searchText) ||
    user?.username?.toLowerCase().includes(searchText)
  );
});

  return (
    <UserLayout>
      <DashboardLayout>

        <div>
          <h1>Discover</h1>
          <div className={styles.searchContainer}>
  <input
    type="text"
    placeholder="🔍 Search users by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)} //    Current text inside input box

    className={styles.searchInput}
  />
</div>

          <div className={styles.allUserProfile}>
            {filteredUsers?.map((user)=>(

              <div 
               onClick={() => router.push(`/view_profile/${user.username}`)}
               key={user._id} className={styles.userCard}>
                <img className={styles.userCard_img}
                  src={`${BASE_URL}/uploads/${user?.profilePicture}`}
                  alt="profile"
                />
                <div>
                <h2>{user?.name}</h2>
                <p>{user?.username}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </DashboardLayout>
    </UserLayout>
  );
}