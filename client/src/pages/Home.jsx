import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomDataTable from "../components/DataTable/DataTable";
import TaskForm from "../components/TaskForm/TaskForm";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import styles from "../styles/Home.module.css";
import { BASE_URL } from "../utils/config";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleErrorResponse = useCallback((error) => {
        const status = error.response?.status;
        const errorMessage = error.response?.data.message || "Ocurrió un error inesperado.";
        if (status === 401) {
            toast.error("No estás autorizado. Por favor, inicia sesión.");
            navigate('/login');
        } else if (status === 403) {
            toast.error("Acceso prohibido.");
        } else {
            toast.error(errorMessage);
        }
    }, [navigate]);

    const makeHttpRequest = async (method, url, requestData = {}) => {
        try {
            const config = {
                withCredentials: true,
            };
            return await axios[method](url, requestData, config);
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const fetchData = useCallback(async () => {
        const makeHttpRequest = async (method, url, data = {}) => {
            try {
                return await axios[method](url, data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        const response = await makeHttpRequest('get', `${BASE_URL}/tasks`);
        if (response) {
            setData(response.data.reverse());
        }
    }, [handleErrorResponse]);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        fetchData();
        console.log("Cookies presentes:", document.cookie);

    }, [fetchData]);

    const handleSave = async (taskData) => {
        const method = taskData._id ? 'patch' : 'post';
        const url = `${BASE_URL}/tasks${taskData._id ? `/${taskData._id}` : ''}`;
        const response = await makeHttpRequest(method, url, taskData);

        if (response) {
            let message = taskData._id ? "Tarea actualizada con éxito!" : "Tarea guardada con éxito!";
            fetchData();
            setIsEditing(false);
            setSelectedTask(null);
            toast.success(message);
        }
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsEditing(true);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${BASE_URL}/tasks/${taskId}`);
            setData(prevData => prevData.filter(task => task._id !== taskId));
            toast.success("Tarea eliminada con éxito!");
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const onCancel = () => {
        setSelectedTask(null);
        setIsEditing(false);
    };

    const sortTasks = (tasks) => {
        return tasks.sort((a, b) => {
            if (!a.completed && b.completed) {
                return -1;
            } else if (a.completed && !b.completed) {
                return 1;
            }
            return 0;
        });
    };

    const toggleTaskCompletion = async (taskId) => {
        try {
            const updatedTask = await axios.patch(`${BASE_URL}/tasks/${taskId}`, { completed: !data.find(task => task._id === taskId).completed });
            setData(prevData =>
                prevData.map(task =>
                    task._id === taskId ? { ...task, completed: updatedTask.data.completed } : task
                )
            );
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    return (
        <div className={styles.containers}>
            <div className={styles.content}>
                <div className={styles.formcontainer}>
                    <TaskForm
                        onSubmit={handleSave}
                        onCancel={onCancel}
                        selectedTask={selectedTask}
                        setIsEditing={setIsEditing}
                    />
                </div>
                <div className={styles.tablecontainer}>
                    <CustomDataTable
                        data={data}
                        deleteItem={task => {
                            setSelectedTask(task);
                            setShowConfirmModal(true);
                        }}
                        sortTasks={sortTasks}
                        onToggleComplete={toggleTaskCompletion}
                        onEdit={handleEditTask}
                    />
                </div>
            </div>
            {showConfirmModal && (
                <ConfirmModal
                    isOpen={showConfirmModal}
                    onRequestClose={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        handleDeleteTask(selectedTask._id);
                        setShowConfirmModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Home;
