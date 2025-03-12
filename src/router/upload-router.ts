import { Router } from "express";
import { upload } from "../lib/storage.ts";
import { AuthenticatedRequest } from "../../types/index.ts";
import path from "path";
import { STORAGE_DIR } from "../index.ts";
import { sendEvent } from "../lib/send-event.ts";

const router = Router();

router.post(
  "/:path(*)?",
  upload.single("file"),
  async (req, res): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const username = authenticatedReq.auth.user;

      if (!authenticatedReq.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const filePath = authenticatedReq.file.path;
      const relativePath = path.relative(STORAGE_DIR, filePath);

      await sendEvent("upload", {
        username,
        path: relativePath,
        originalName: authenticatedReq.file.originalname,
        size: authenticatedReq.file.size,
        mimetype: authenticatedReq.file.mimetype,
        ip: req.ip,
      });

      res.status(200).json({
        message: "File uploaded successfully",
        path: relativePath,
        size: authenticatedReq.file.size,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

export default router;
