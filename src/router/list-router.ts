import { Router } from "express";
import { AuthenticatedRequest } from "../../types/index.ts";
import path from "path";
import { STORAGE_DIR } from "../index.ts";
import { sendEvent } from "../lib/send-event.ts";
import { existsSync, readdirSync, statSync } from "fs";

const router = Router();

router.get("/:path(*)?", async (req, res): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const username = authenticatedReq.auth.user;

    const dirPath = req.params.path
      ? path.join(STORAGE_DIR, username, req.params.path)
      : path.join(STORAGE_DIR, username);

    if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
      res.status(404).json({ error: "Directory not found" });
      return;
    }

    const items = readdirSync(dirPath).map((item) => {
      const itemPath = path.join(dirPath, item);
      const stats = statSync(itemPath);
      return {
        name: item,
        path: path.relative(path.join(STORAGE_DIR, username), itemPath),
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modified: stats.mtime,
      };
    });

    await sendEvent("list", {
      username,
      path: req.params.path || "/",
      ip: req.ip,
      itemCount: items.length,
    });

    res.status(200).json({
      path: req.params.path || "/",
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to list directory" });
  }
});

export default router;
