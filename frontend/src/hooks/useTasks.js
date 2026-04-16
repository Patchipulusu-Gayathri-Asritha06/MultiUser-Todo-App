import { useState, useCallback } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState({ Pending: 0, "In-Progress": 0, Completed: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", { params });
      setTasks(res.data.data);
      setPagination(res.data.pagination);
      setStats(res.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    setActionLoading(true);
    try {
      const res = await api.post("/tasks", taskData);
      toast.success("Task created! ✅");
      return { success: true, data: res.data.data };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors ? errors.map((e) => e.message).join(", ") : err.response?.data?.message || "Failed to create task";
      toast.error(msg);
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      toast.success("Task updated! ✏️");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update task";
      toast.error(msg);
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted 🗑️");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
      toast.success(`Status → ${status}`);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      return { success: false };
    }
  }, []);

  const deleteCompleted = useCallback(async () => {
    setActionLoading(true);
    try {
      const res = await api.delete("/tasks/completed");
      toast.success(res.data.message);
      return { success: true };
    } catch (err) {
      toast.error("Failed to delete completed tasks");
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    tasks, pagination, stats, loading, actionLoading,
    fetchTasks, createTask, updateTask, deleteTask, updateStatus, deleteCompleted,
  };
};

export default useTasks;
