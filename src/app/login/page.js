"use client";

import styles from "../page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const uri = "http://localhost:3000";

export default function Login() {
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [err, setErr] = useState("");
  const sendLogin = async () => {
    if (email !== "" && password !== "") {
      const options = {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const request = await fetch(`${uri}/login/`, options);
      const response = await request.json();
      if (request.ok) {
        Cookies.set("jwt_token", response.jwtToken);
        Cookies.set("userId", response.dbUser?.userId);
        console.log(router);
        router.replace("/");
      } else {
        setErr(response.err);
      }
    } else {
      setErr("Please fill all the details");
    }
  };
  const sendRegister = async () => {
    if (name !== "" && email !== "" && pass !== "") {
      const options = {
        method: "POST",
        body: JSON.stringify({ name, password, email }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const request = await fetch(`${uri}/users/`, options);
      const response = await request.json();
      if (request.ok) {
        Cookies.set("jwt_token", response.jwtToken);
        Cookies.set("userId", response.newUserId);
        router.replace("/");
      } else {
        setErr(response.err);
      }
    } else {
      setErr("Please fill all the details");
    }
  };
  const login = () => {
    if (!register) {
      sendLogin();
    } else {
      console.log("yo");
      setRegister(false);
    }
  };
  const reg = () => {
    if (register) {
      sendRegister();
    } else {
      setRegister(true);
      console.log("bo");
    }
  };
  return (
    <div className={styles.page}>
      <h1>Login</h1>
      <div>
        {register ? (
          <form>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className={styles.customInp}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={styles.customInp}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="pass">Password</label>
            <input
              type="password"
              id="pass"
              className={styles.customInp}
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </form>
        ) : (
          <form>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={styles.customInp}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="pass">Password</label>
            <input
              type="password"
              id="pass"
              className={styles.customInp}
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </form>
        )}
        <button onClick={login}>Login</button>
        <button onClick={reg}>Register</button>
        {err.length > 0 && <p className={styles.error}>{err}</p>}
      </div>
    </div>
  );
}
