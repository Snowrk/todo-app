"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const uri = "http://localhost:3000";

export default function UserProfile() {
  const router = useRouter();
  const userId = Cookies.get("userId");
  const token = Cookies.get("jwt_token");
  const path = token ? "/" : "/login";
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const logout = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("userId");
    router.replace("/login");
  };
  const changePass = async () => {
    const options = {
      method: "PUT",
      body: JSON.stringify({ password, pass }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const request = await fetch(`${uri}/users/${userId}/password`, options);
    const response = await request.json();
    setMsg(response.msg);
  };
  const commitChanges = async () => {
    const options = {
      method: "PUT",
      body: JSON.stringify({ name, email }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const request = await fetch(`${uri}/users/${userId}`, options);
    if (!request.ok) {
      console.log("error changing profile details");
    }
    setEdit(false);
  };
  useEffect(() => {
    const getData = async () => {
      const options = {
        method: "GET",
        headers: {
          authorization: `bearer ${token}`,
        },
      };
      const request = await fetch(`${uri}/profile/${userId}`, options);
      const response = await request.json();
      console.log(response);
      if (request.ok) {
        setName(response.name);
        setEmail(response.email);
      } else {
        console.log("error retriving the user data");
      }
    };
    getData();
  }, []);
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1>User Profile</h1>
        <Link as="/" href={path}>
          <button>Home</button>
        </Link>
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        {edit ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.customInp}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setName(e.target.value)}
              className={styles.customInp}
            />
          </>
        ) : (
          <>
            <p>name: {name}</p>
            <p>email: {email}</p>
          </>
        )}
        <button onClick={() => setEdit(!edit)}>Edit</button>
        {edit && <button onClick={commitChanges}>Confirm</button>}
      </div>
      <div>
        <h2>Change Password</h2>
        <label htmlFor="oldPass">Previous Password</label>
        <input
          id="oldPass"
          type="password"
          placeholder="previous password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className={styles.customInp}
        />
        <label>New Password</label>
        <input
          id="newPass"
          type="password"
          placeholder="new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.customInp}
        />
        <button onClick={changePass}>Change</button>
        {msg.length > 0 && <p>{msg}</p>}
      </div>
    </div>
  );
}
