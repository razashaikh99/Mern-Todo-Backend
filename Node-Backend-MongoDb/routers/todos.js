import express from "express";
import sendResponse from "../helpers/sendResponse.js";
import { authenticateAdmin, authenticateUser } from "../middleware/authentication.js";
import Todos from "../models/Todos.js";
import cors from 'cors';

app.use(cors());

const router = express.Router();

router.post("/", authenticateUser, async (req, res) => {
  try {
    const newTodo = await Todos.create({
      todo: req.body.todo,
      createdBy: req.user._id,
    });
    sendResponse(res, 200, newTodo, false, "Todo added successfully");
  } catch (error) {
    sendResponse(res, 500, null, true, "Error adding todo");
  }
});

router.get("/", authenticateUser, async (req, res) => {
  try {
    const todos = await Todos.find({ createdBy: req.user._id });
    sendResponse(res, 200, todos, false, "Todos fetched successfully");
  } catch (error) {
    sendResponse(res, 500, null, true, "Error fetching todos");
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const deletedTodo = await Todos.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return sendResponse(res, 404, null, true, "Todo not found");
    }
    sendResponse(res, 200, null, false, "Todo deleted successfully");
  } catch (error) {
    sendResponse(res, 500, null, true, "Error deleting todo");
  }
});


export default router;
