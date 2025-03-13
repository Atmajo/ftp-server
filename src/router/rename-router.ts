import path from "path";
import fs from "fs";
import { Router } from "express";
import { sendEvent } from "../lib/send-event.ts";
import { STORAGE_DIR } from "../index.ts";
import { AuthenticatedRequest } from "../../types/index.ts";

const router = Router();

router.put("/", async (req, res) => {
  try {
    const { oldPath, newPath } = req.body;
    if (!oldPath || !newPath) {
      res.status(400).json({ error: "Old and new paths are required" });
      return;
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const username = authenticatedReq.auth.user;
    const sourcePath = path.join(STORAGE_DIR, username, oldPath);
    const destPath = path.join(STORAGE_DIR, username, newPath);

    if (!fs.existsSync(sourcePath)) {
      res.status(404).json({ error: "Source file or directory not found" });
      return;
    }

    if (fs.existsSync(destPath)) {
      res.status(409).json({ error: "Destination already exists" });
    }

    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      return;
    }

    fs.renameSync(sourcePath, destPath);

    await sendEvent("rename", {
      username,
      oldPath: path.join(username, oldPath),
      newPath: path.join(username, newPath),
      ip: req.ip,
    });

    res.status(200).json({
      message: "Item renamed successfully",
      oldPath,
      newPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to rename item" });
  }
});

export default router;
