"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

const uri = process.env.API_BASE_URL;

const TodoItem = (props) => {
  const { item, setTodoList } = props;
  const token = Cookies.get("jwt_token");
  const id = item.id;
  const [status, setStatus] = useState(item.status);
  const updateTodo = async (e) => {
    setStatus(e.target.value);
    setTodoList((prev) => [
      ...[...prev].filter((todo) => todo.id !== item.id),
      { id: item.id, status: e.target.value, todo: item.todo },
    ]);
    const options = {
      method: "PUT",
      body: JSON.stringify({ status: e.target.value }),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${token}`,
      },
    };
    const request = await fetch(`${uri}/todos/${id}/`, options);
    if (!request.ok) {
      console.log("error updating the record");
    }
  };
  const deleteTodo = async () => {
    setTodoList((prev) => [...prev].filter((todo) => todo.id !== item.id));
    const options = {
      method: "DELETE",
      headers: {
        authorization: `bearer ${token}`,
      },
    };
    const request = await fetch(`${uri}/todos/${id}/`, options);
    if (!request.ok) {
      console.log("error deleting the record");
    }
  };
  return (
    <div className={styles.todoItem}>
      <p
        className={
          status === "DONE" || status === "COMPLETED"
            ? styles.done
            : styles.notDone
        }
      >
        {item.todo}
      </p>
      <div>
        <label htmlFor="status">status</label>
        <select id="status" value={status} onChange={updateTodo}>
          <option value="DONE">done</option>
          <option value="IN PROGRESS">in progress</option>
          <option value="PENDING">pending</option>
          <option value="COMPLETED">completed</option>
        </select>
      </div>
      <button onClick={deleteTodo}>Delete</button>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [todoList, setTodoList] = useState([]);
  const [todo, setTodo] = useState("");
  const token = Cookies.get("jwt_token");
  const path = token ? "/user-profile" : "/login";
  const addTodo = async (e) => {
    const id = uuidv4();
    setTodoList((prev) => [...prev, { id: id, todo: todo, status: "PENDING" }]);
    const options = {
      method: "POST",
      body: JSON.stringify({
        id: id,
        todo: todo,
        status: "PENDING",
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${token}`,
      },
    };
    const request = await fetch(`${uri}/todos/`, options);
    if (!request.ok) {
      console.log("error inserting the todo");
    }
  };
  const logout = () => {
    Cookies.remove("jwt_token");
    router.replace("/login");
  };
  useEffect(() => {
    const getData = async () => {
      const options = {
        method: "GET",
        headers: {
          authorization: `bearer ${token}`,
        },
      };
      const request = await fetch(`${uri}/todos/`, options);
      const response = await request.json();
      if (request.ok) {
        setTodoList(response);
      }
    };
    getData();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1>Todo Application</h1>
        <Link as="/user-profile" href={path}>
          <button>User Profile</button>
        </Link>
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <div className={styles.inp}>
          <input
            type="text"
            id="addTodo"
            placeholder="addTodo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button onClick={addTodo}>Add</button>
        </div>
        <div>
          {todoList.map((item) => (
            <TodoItem item={item} setTodoList={setTodoList} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
