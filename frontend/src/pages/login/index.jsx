import UserLayout from "@/layout/UserLayout";
import { useEffect, useState, useRef } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

export default function Login() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const redirected = useRef(false); // ✅ IMPORTANT

  const [isLoginMethod, setIsLoginMethod] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

   useEffect(() => {
    if (authState.loggedIn && !redirected.current) {
      redirected.current = true;
      router.replace("/dashboard");
    }
  }, [authState.loggedIn]);

  /* ✅ Clear message on switch */
  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoginMethod]);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and Password required");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const handleRegister = () => {
    if (!username || !name || !email || !password) {
      alert("All fields are required");
      return;
    }
    dispatch(registerUser({ username, name, email, password }));
  };

  return (
    <UserLayout>
      <h4
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        ← Go Back
      </h4>

      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {/* LEFT */}
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {isLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            {authState.message && (
              <p style={{ color: authState.isError ? "red" : "green" }}>
                {authState.message}
              </p>
            )}

            <div className={styles.inputContainer}>
              {!isLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    className={styles.inputField}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    className={styles.inputField}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <input
                className={styles.inputField}
                type="email"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className={styles.inputField}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                disabled={authState.isLoading}
                onClick={isLoginMethod ? handleLogin : handleRegister}
                className={styles.buttonWithOutline}
              >
                {authState.isLoading
                  ? "Please wait..."
                  : isLoginMethod
                  ? "Sign In"
                  : "Sign Up"}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.cardContainer_right}>
            <p>
              {isLoginMethod
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              onClick={() => setIsLoginMethod(!isLoginMethod)}
              className={styles.buttonWithOutline}
            >
              {isLoginMethod ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
