const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  deleteCompletedTasks,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const {
  taskValidation,
  taskUpdateValidation,
  validate,
} = require("../middleware/validation");

// All routes are protected
router.use(protect);

router.route("/")
  .get(getTasks)
  .post(taskValidation, validate, createTask);

router.delete("/completed", deleteCompletedTasks);

router.route("/:id")
  .get(getTask)
  .put(taskUpdateValidation, validate, updateTask)
  .delete(deleteTask);

router.patch("/:id/status", updateTaskStatus);

module.exports = router;
