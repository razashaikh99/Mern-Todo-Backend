import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { AppRoutes } from "../constant/AppRoutes";
import Cookies from "js-cookie";

export default function Task() {
  const { user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    setLoading(true);
    axios
      .get(AppRoutes.getTask, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((res) => setTasks(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const addTask = () => {
    if (task.length < 4) {
      alert("Task must be at least 4 characters long!");
      return;
    }
    axios
      .post(
        AppRoutes.addTask,
        { task },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      )
      .then(() => {
        setTask("");
        getTasks();
      })
      .catch((err) => console.error(err));
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`${AppRoutes.deleteTask}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(() => getTasks()) // After deletion, fetch updated tasks
      .catch((err) => console.error("Delete Error:", err));
  };    ``  

  return (
    <div className="container mx-auto">
      <div className="flex justify-between my-10">
        <h1 className="text-3xl font-semibold font-mono">
          Hello, {user?.fullname}
        </h1>

        <button
          className="bg-red-100 rounded p-2 px-4"
          onClick={() => {
            setUser(null);
            Cookies.set("token", null);
          }}
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={task}
          className="border rounded-s-full p-4 flex-grow border-black"
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add Task"
        />
        <button
          disabled={task.length < 4}
          className="bg-blue-400 rounded-e-full p-4 px-4 text-white"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        tasks.map((data) => (
          <div key={data._id} className="flex items-center gap-4 my-2">
            <h1 className="font-mono font-semibold text-2xl py-4 bg-slate-50 px-2 flex-grow">
              {data.task}
            </h1>
            <button
              className="bg-red-400 p-2 px-4 text-white rounded"
              onClick={() => deleteTask(data._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
