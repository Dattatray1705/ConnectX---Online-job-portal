import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import UserLayout from "../layout/UserLayout";
import img from "next/image";


const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with friends without Exaggeration</p>
            <p>A True job portal platform, with stories no bluf!</p>

            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              Join Now!
            </div>
          </div>

          <div className={styles.mainContainer_right}>


<img
  src="https://media.licdn.com/dms/image/sync/v2/D4D27AQHP85FZVvAf5g/articleshare-shrink_800/B4DZju0YQEGkAI-/0/1756353365823?e=2147483647&v=beta&t=A2OsAFQ_-3nYQZAm6NfALYDIKvG9-VV3SK6w1yJISoA"
  alt="ConnectX"
  style={{ width: "700px", height: "auto" }}
/>



          </div>
        </div>
      </div>
    </UserLayout>
  );
}
