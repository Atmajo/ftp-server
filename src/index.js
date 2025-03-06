import express from "express";
import { config } from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";

config();

const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../uploads/images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-iedc-lab-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "../uploads")));
app.use(cors());

app.get("/", (req, res) => {
  return res.render("index");
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
  }

  console.log(req.body);
  console.log(req.file);

  return res.redirect("/");
});

app.get("/download", (req, res) => {
  const file = path.resolve(
    __dirname,
    "../uploads/images/1741190572242-iedc-lab-MainBefore.jpg"
  );
  res.download(file);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
