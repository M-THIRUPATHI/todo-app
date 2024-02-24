//import Popup from "reactjs-popup";
//import { AiFillCloseCircle } from "react-icons/ai";
//import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import "./index.css";
const Home = () => {
  const jwtToken = Cookies.get("jwt_token");

  const [todoList, setTodoList] = useState([]);
  const [userInput, setUserInput] = useState("");

  const getTodo = async () => {
    const api = axios.create({
      baseURL: "http://localhost:4000",
    });
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    api
      .get("/")
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getTodo();
  });

  const addTodo = () => {
    const api = axios.create({
      baseURL: "http://localhost:4000",
    });
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    api
      .post("/add", { todo: userInput, status: "pending" })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setUserInput("");
  };

  const editTodo = (value, id, status) => {
    console.log(value,id,status)
    const currentStatus = status === "completed" ? true : false;
    let newStatus;
    if (value && !currentStatus) {
      newStatus = "completed";
    } else {
      newStatus = "pending";
    }
    const api = axios.create({
      baseURL: "http://localhost:4000",
    });
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    api
      .put(`/edit/${id}`, { status: newStatus })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteTodo = (id) => {
    const api = axios.create({
      baseURL: "http://localhost:4000",
    });
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    api
      .delete(`/delete/${id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Header />
      <div className="todos-bg-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="todos-heading">Todos</h1>
              <h1 className="create-task-heading">
                Create <span className="create-task-heading-subpart">Task</span>
              </h1>
              <input
                type="text"
                className="todo-user-input"
                placeholder="What needs to be done?"
                onChange={(event) => {
                  setUserInput(event.target.value);
                }}
                value={userInput}
              />
              <button className="add-button" onClick={addTodo}>
                Add
              </button>
              <h1 className="todo-items-heading">
                My <span className="todo-items-heading-subpart">Tasks</span>
              </h1>
              <ul className="todo-items">
                {todoList.map((eachTodo) => (
                  <li key={eachTodo.id} className="todo-item">
                    <input
                      type="checkbox"
                      onChange={(event) => {
                        editTodo(
                          event.target.checked,
                          eachTodo.id,
                          eachTodo.status
                        );
                      }}
                      checked={eachTodo.status === "completed"}
                      className="todo-check-box"
                    />
                    <span
                      className={
                        eachTodo.status === "completed"
                          ? "text-decoration-on"
                          : "text-decoration-off"
                      }
                    >
                      {eachTodo.todo}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        deleteTodo(eachTodo.id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;


