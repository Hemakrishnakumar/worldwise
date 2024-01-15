import { Link, useNavigate } from "react-router-dom";
import PageNavigation from "../components/PageNavigation";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuthContext();
  const [isIncorrectLogin, setIsIncorrectLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated]);

  function submitHandler(e) {
    e.preventDefault();
    if (!login(email, password)) setIsIncorrectLogin(true);
    else setIsIncorrectLogin(false);
  }

  return (
    <main className={styles.login}>
      <PageNavigation />
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="abc@gmail.com"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Link to="/app">
            <Button type="primary" onClick={submitHandler}>
              Login
            </Button>
          </Link>
        </div>
        {isIncorrectLogin && (
          <div>
            <p style={{ color: "red", fontSize: "16px" }}>
              Incorrect Email or password
            </p>
          </div>
        )}
      </form>
    </main>
  );
}
