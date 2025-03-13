import { Router } from "express";
import { AuthenticatedRequest } from "../../types/index.ts";
import path from "path";
import { STORAGE_DIR } from "../index.ts";
import { sendEvent } from "../lib/send-event.ts";
import { existsSync, rmdirSync, statSync, unlinkSync } from "fs";

const router = Router();

router.delete("/:path(*)", async (req, res) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const username = authenticatedReq.auth.user;
    const itemPath = path.join(STORAGE_DIR, username, req.params.path);

    if (!existsSync(itemPath)) {
      res.status(404).json({ error: "File or directory not found" });
      return;
    }

    const isDirectory = statSync(itemPath).isDirectory();

    if (isDirectory) {
      rmdirSync(itemPath, { recursive: true });
    } else {
      unlinkSync(itemPath);
    }

    await sendEvent("delete", {
      username,
      path: path.join(username, req.params.path),
      isDirectory,
      ip: req.ip,
    });

    res.status(200).json({
      message: `${isDirectory ? "Directory" : "File"} deleted successfully`,
      path: req.params.path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;