import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { STORAGE_DIR } from "../index.ts";
import { AuthenticatedRequest } from "../../types/index.ts";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const username = authenticatedReq.auth.user;
    const userDir = path.join(STORAGE_DIR, username);

    if (!existsSync(userDir)) {
      mkdirSync(userDir, { recursive: true });
    }

    if (authenticatedReq.params.path) {
      const subDir = path.join(userDir, authenticatedReq.params.path);
      if (!existsSync(subDir)) {
        mkdirSync(subDir, { recursive: true });
      }
      return cb(null, subDir);
    }

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
