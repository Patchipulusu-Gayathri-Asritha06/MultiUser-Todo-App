import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiTrash2, FiRefreshCw, FiInbox } from "react-icons/fi";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import StatsBar from "../components/StatsBar";

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  limit: 9,
};

const Dashboard = () => {
  const {
    tasks, pagination, stats, loading, actionLoading,
    fetchTasks, createTask, updateTask, deleteTask, updateStatus, deleteCompleted,
  } = useTasks();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadTasks = useCallback(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    params.sortBy = filters.sortBy;
    params.order = filters.order;
    params.page = filters.page;
    params.limit = filters.limit;
    fetchTasks(params);
  }, [filters, fetchTasks]);

  useEffect(() => {
    const timeout = setTimeout(loadTasks, filters.search ? 400 : 0);
    return () => clearTimeout(timeout);
  }, [filters, loadTasks]);

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  const handleSubmit = async (formData) => {
    const result = editTask
      ? await updateTask(editTask._id, formData)
      : await createTask(formData);
    if (result?.success) loadTasks();
    return result;
  };

  const handleDelete = async (id) => {
    const result = await deleteTask(id);
    if (result?.success) {
      setDeleteConfirm(null);
      loadTasks();
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    loadTasks();
  };

  const handleDeleteCompleted = async () => {
    const result = await deleteCompleted();
    if (result?.success) loadTasks();
  };

  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleReset = () => setFilters(DEFAULT_FILTERS);
  const handlePageChange = (page) => setFilters((p) => ({ ...p, page }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Tasks</h1>
          <p className="dashboard-subtitle">Manage and track your work efficiently</p>
        </div>
        <div className="header-actions">
          {stats?.Completed > 0 && (
            <button
              className="btn btn-danger-outline"
              onClick={handleDeleteCompleted}
              disabled={actionLoading}
              title="Delete all completed tasks"
            >
              <FiTrash2 size={15} /> Clear Completed
            </button>
          )}
          <button className="btn btn-primary" onClick={openCreate}>
            <FiPlus size={18} /> New Task
          </button>
        </div>
      </div>

      <StatsBar stats={stats} />

      <FilterBar
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
      />

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <FiInbox size={56} className="empty-icon" />
          <h3>No tasks found</h3>
          <p>
            {filters.search || filters.status || filters.priority
              ? "Try adjusting your filters"
              : "Create your first task to get started!"}
          </p>
          {!filters.search && !filters.status && !filters.priority && (
            <button className="btn btn-primary" onClick={openCreate}>
              <FiPlus size={16} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={(id) => setDeleteConfirm(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editTask={editTask}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="confirm-icon">
              <FiTrash2 size={28} />
            </div>
            <h3>Delete Task?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
