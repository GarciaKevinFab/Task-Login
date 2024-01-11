import React, { useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./DataTable.module.css";
import ModalContainer from "../ModalContainer/ModalContainer";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const TASKS_PER_PAGE = 9;

const CustomDataTable = ({ data, onEdit, deleteItem, sortTasks, onToggleComplete }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const sortedTasks = sortTasks(data);
  const totalPages = Math.ceil(sortedTasks.length / TASKS_PER_PAGE);
  const lastTaskIndex = currentPage * TASKS_PER_PAGE;
  const firstTaskIndex = lastTaskIndex - TASKS_PER_PAGE;
  const currentTasks = sortedTasks.slice(firstTaskIndex, lastTaskIndex);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  const completedTasks = data.filter(task => task.completed).length;

  return (
    <div>
      <div className={styles.taskCounter}>
        <span>{completedTasks}/{data.length} Tareas Completadas</span>
      </div>
      <div className={`${styles["card-container"]} ${styles.datatable}`}>
        {currentTasks.length > 0 ? (
          currentTasks.map((row) => (
            <TaskCard
              key={row._id}
              title={row.title}
              description={row.description}
              completed={row.completed}
              onEdit={() => onEdit(row)}
              onDelete={() => deleteItem(row)}
              onToggleComplete={() => onToggleComplete(row._id)}
              onTaskView={() => handleViewTask(row)}
              task={row}
            />
          ))
        ) : (
          <div className={styles.noTasksMessage}>
            No hay tareas para mostrar.
          </div>
        )}
        {showModal && (
          <ModalContainer
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            title="Detalles de la Tarea"
          >
            <p>Título: {selectedTask.title}</p>
            <p>Descripción: {selectedTask.description}</p>
            <p>Completado: {selectedTask.completed ? "Sí" : "No"}</p>
          </ModalContainer>
        )}
      </div>
      <div className={styles.pagination}>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          <FaAngleLeft />
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default CustomDataTable;
