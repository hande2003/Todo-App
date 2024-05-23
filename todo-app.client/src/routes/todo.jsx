/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useLoaderData, useFetcher } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import capitalize from "../../public/JS/file";
import TaskComponent from "../components/TaskComponent";
import "bootstrap-icons/font/bootstrap-icons.css";

export async function loader() {
    try {
        const res = await axios.get('/auth/auth-user');

        if (res.status === 200) {
            const userData = await axios.get("/todotasks");
            const userdata = res.data;
            const user = `${capitalize(userdata.firstname)} ${capitalize(userdata.lastname)}`;
            return { user: user, userInfo: userData.data };
        }
    } catch (error) {
        console.error(error.response.data);
        return null;
    }
}

const Todo = () => {
    const { userInfo } = useLoaderData();
    const [taskList, setTaskList] = useState(() => userInfo);
    const [selectedTaskList, setSelectedTaskList] = useState(() => userInfo);
    const [currentTask, setCurrentTask] = useState(() => "");

    let selectRef = useRef(() => null);
    let [selectedItems, setSelectedItems] = useState(() => "all");

    useEffect(() => {
        let selectValue = selectRef.current.value;

        // Your code to filter elements here

        switch (selectValue) {
            case "completed": {
                let completedItems = taskList.filter((task) => task.isComplete);
                setSelectedTaskList(() => completedItems);
                break;
            }
            case "incomplete": {
                setSelectedTaskList(() => taskList.filter((task) => !task.isComplete));
                break;
            }
            default: {
                setSelectedTaskList(() => taskList);
                break;
            }
        }
    }, [selectedItems, taskList]);

    const handleChange = (e) => {
        setCurrentTask(() => e.target.value);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const addtask = {
            taskName: currentTask,
            isComplete: false,
        };

        if (currentTask.trim() !== "") {
            try {
                const result = await axios.post("/todotasks", addtask);
                if (result.status === 201) {
                    setTaskList((prevTasks) => [...prevTasks, result.data]);
                    selectRef.current.options[0].selected = true;
                    setSelectedItems(() => "all");
                }
            } catch (error) {
                console.error(error);
            }
            setCurrentTask("");
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const result = await axios.delete(`/todotasks/${taskId}`);
            if (result.status == 204) {
                setTaskList((prevTasks) => prevTasks.filter((task) => task.taskId !== parseInt(taskId)));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckboxChange = async (changeItem) => {
        try {
            const result = await axios.put(`/todotasks/${changeItem.taskId}`, changeItem);
            if (result.status == 204) {
                setTaskList(() => taskList.map((task) => task.taskId === changeItem.taskId ? { ...task, isComplete: changeItem.isComplete } : task));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <AuthStatus />
            <div className="card mt-3">
                <div className="card-body">
                    <div className="row">
                        <div className="col-8">
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="todo-input"
                                    placeholder="Add a task"
                                    aria-label="Add a task"
                                    aria-describedby="add"
                                    value={currentTask}
                                    onChange={handleChange}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="submit"
                                    onClick={handleAddTask}
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                id="task-filter"
                                name="tasks"
                                onChange={(e) => setSelectedItems(() => e.target.value)}
                                ref={selectRef}
                            >
                                <option value="all" defaultValue={"all"}>
                                    All
                                </option>
                                <option value="completed">Completed</option>
                                <option value="incomplete">Incomplete</option>
                            </select>
                        </div>
                    </div>
                    {selectedTaskList.length > 0 && (
                        <TaskComponent tasks={selectedTaskList} onDelete={handleDeleteTask} onCheckboxChange={handleCheckboxChange} />
                    )}
                </div>
            </div>
        </>
    );
}

function AuthStatus() {
    let { user } = useLoaderData();
    let fetcher = useFetcher();

    let isLoggingOut = fetcher.formData != null;

    return (

        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <h3 className="fw-normal">Welcome <span className="fst-italic fw-semibold">{user}</span>!</h3>
                <fetcher.Form method="post" action="/logout">
                    <button className="btn btn-outline-info" type="submit" disabled={isLoggingOut}>
                        {isLoggingOut ? "Signing out..." : "Sign out"}
                    </button>
                </fetcher.Form>
            </div>
        </nav>
    );
}

export default Todo;
