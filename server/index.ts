import express from "express";
import cors from "cors";
import multer from "multer";
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

const upload = multer({ storage: storage });
app.get("/", (req, res) => {
  res.json({
    data: "hello",
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200).json({
    message: "file recsived",
  });
});

app.listen(8000, () => {
  console.log("server running on " + 8000);
});
