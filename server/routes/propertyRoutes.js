import express from "express";
import {
  toggleSaveProperty,
  getSavedProperties,
} from "../controllers/propertyController.js";
import { protect } from "../middlewares/auth.js";

const propertyRouter = express.Router();

propertyRouter.post("/save", protect, toggleSaveProperty);
propertyRouter.get("/saved", protect, getSavedProperties);

export default propertyRouter;
