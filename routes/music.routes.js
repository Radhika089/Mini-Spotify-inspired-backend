import express from "express";
import { createAlbum, createMusic } from "../controllers/music.controller.js";
import multer from "multer";
import { isArtist, protect } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const musicRouter = express.Router();

musicRouter.post(
  "/upload",
  protect,
  isArtist,
  upload.single("music"),
  createMusic,
);

musicRouter.post("/album", protect, isArtist, createAlbum);

export default musicRouter;
