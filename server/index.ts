import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
const app = express();
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileQueue = new Queue("fileQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const upload = multer({ storage: storage });
app.get("/", (req, res) => {
  res.json({
    data: "hello",
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    fileQueue.add(
      "file",
      JSON.stringify({
        name: req.file.originalname,
        destination: req.file.destination,
        path: req.file.path,
      })
    );
  }
  res.status(200).json({
    message: "file recived",
  });
});

app.listen(8000, () => {
  console.log("server running on " + 8000);
});
