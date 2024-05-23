/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function TaskComponent({ tasks, onDelete, onCheckboxChange }) {
    const [taskList, setTaskList] = useState(() => tasks);
    console.log(tasks);
    useEffect(() => {
        setTaskList(() => tasks);
    }, [tasks]);

    const handleDelete = (e) => {
        e.preventDefault();
        const regex = /delete-(\d+)/;
        let deletetask = e.target.closest('button').querySelector('i').id;
        let taskId = deletetask.match(regex)[1];
        onDelete(taskId); // Use the optimistic delete function
    };

    const handleCheckbox = (e) => {
        const regex = /change-(\d+)/;
        let changetask = e.target;
        let taskId = changetask.id.match(regex)[1];
        let changeItem = {
            taskId: parseInt(taskId),
            isComplete: changetask.checked
        }
        onCheckboxChange(changeItem); // Use the optimistic update function
    };

    return (
        <ul style={{ listStyleType: "none" }} className="p-0 w-75 mx-auto">
            {taskList.map((task) => (
                <li key={task.taskId} className="mb-3">
                    <div className="input-group">
                        <div className="input-group-text">
                            <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                aria-label="Checkbox for following text input"
                                id={`change-${task.taskId}`}
                                onChange={handleCheckbox}
                                checked={task.isComplete}
                            />
                        </div>
                        <input
                            type="text"
                            className={`form-control ${task.isComplete ? 'text-decoration-line-through' : ''}`}
                            aria-label="Text input with checkbox"
                            value={task.taskName}
                            readOnly
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleDelete}>
                            <i className="bi bi-trash2" id={`delete-${task.taskId}`}></i>
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default TaskComponent;
