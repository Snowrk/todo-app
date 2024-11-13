"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const uri = "http://localhost:3000";

const TodoItem = (props) => {
  const { item } = props;
  const [status, setStatus] = useState(item.status);
  const updateTodo = async (e) => {
    setStatus(e.target.value);
    const id = item.id;
    const options = {
      method: "PUT",
      body: JSON.stringify({ status: e.target.value }),
      headers: {
        "Content-Type": "application/json",
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
    };
    const request = await fetch(`${uri}/todos/${id}/`, options);
    if (!request.ok) {
      console.log("error deleting the record");
    }
  };
  return (
    <div className={styles.todoItem}>
      <p>{item.todo}</p>
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
  const [todoList, setTodoList] = useState([]);
  const [todo, setTodo] = useState("");
  const addTodo = async (e) => {
    setTodoList((prev) => [
      ...prev,
      { id: uuidv4(), todo: todo, status: "PENDING" },
    ]);
    const options = {
      method: "POST",
      body: JSON.stringify({
        id: uuidv4(),
        todo: e.target.textContent,
        status: "PENDING",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const request = await fetch(`${uri}/todos/`, options);
    if (!request.ok) {
      console.log("error inserting the todo");
    }
  };
  useEffect(() => {
    const getData = async () => {
      const id = 2;
      const options = {
        method: "GET",
      };
      const request = await fetch(`${uri}/todos/${id}/`, options);
      const response = await request.json();
      if (request.ok) {
        setTodoList(response);
        console.log(response);
      }
    };
    getData();
  }, []);

  return (
    <div className={styles.page}>
      <h1>Todo Application</h1>
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
            <TodoItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
