import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomDataTable from "../components/DataTable/DataTable";
import Taskform from "../components/TaskForm/TaskForm";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import styles from "../styles/Home.module.css";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        } else {
            axios.defaults.withCredentials = true;

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchData();
        }
    }, [navigate]);


    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/tasks`);
            setData(response.data.reverse());
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const handleErrorResponse = (error) => {
        if (error.response?.status === 401) {
            toast.error("No estás autorizado. Por favor, inicia sesión.");
            navigate('/login');
        } else {
            toast.error(error.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };

    const handleSave = async (taskData) => {
        try {
            let message = "Tarea guardada con éxito!";
            if (taskData._id) {
                const updatedTask = await axios.patch(`${BASE_URL}/tasks/${taskData._id}`, taskData);
                setData(prevData =>
                    prevData.map(task =>
                        task._id === taskData._id ? updatedTask.data : task
                    )
                );
                message = "Tarea actualizada con éxito!";
            } else {
                const newTask = await axios.post(`${BASE_URL}/tasks`, taskData);
                setData(prevData => [newTask.data, ...prevData]);
            }
            setIsEditing(false);
            setSelectedTask(null);
            toast.success(message);
        } catch (error) {
            handleErrorResponse(error);
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
                    <Taskform
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
