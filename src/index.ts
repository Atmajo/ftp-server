import express from "express";
import expressBasicAuth from "express-basic-auth";
import path from "path";
import { fileURLToPath } from "url";
import uploadRouter from "./router/upload-router.ts";
import listRouter from "./router/list-router.ts";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const STORAGE_DIR = path.join(__dirname, "ftp-storage");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  expressBasicAuth({
    users: { admin: "admin123", user: "user123" },
    challenge: true,
    unauthorizedResponse: "Unauthorized access",
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use("/upload", uploadRouter);
app.use("/list", listRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
