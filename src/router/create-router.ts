import { Router } from "express";
import { AuthenticatedRequest } from "../../types/index.ts";
import path from "path";
import { STORAGE_DIR } from "../index.ts";
import { sendEvent } from "../lib/send-event.ts";
import { existsSync, mkdirSync } from "fs";

const router = Router();

router.post("/:path(*)", async (req, res): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const username = authenticatedReq.auth.user;
    const dirPath = path.join(STORAGE_DIR, username, req.params.path);

    if (existsSync(dirPath)) {
      res.status(409).json({ error: "Directory already exists" });
      return;
    }

    mkdirSync(dirPath, { recursive: true });

    await sendEvent("mkdir", {
      username,
      path: path.join(username, req.params.path),
      ip: req.ip,
    });

    res.status(201).json({
      message: "Directory created successfully",
      path: req.params.path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create directory" });
  }
});
