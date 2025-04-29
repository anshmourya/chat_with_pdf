import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { vectorStore } from "./worker/worker";
import { OpenAI } from "openai";
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

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/nebius/v1",
  apiKey: process.env.HUGGING_FACE_API,
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

app.get("/chat", async (req: express.Request, res: express.Response) => {
  try {
    const userQuery = req.query.message as string;
    const data = await vectorStore.similaritySearch(userQuery, 2);
    const SYSTEM_PROMPT = `You are a helpful assistant. You have access to the following documents and you can answer questions based on them:
    ${data.map((doc) => doc.pageContent).join("\n\n")}`;

    const chatCompletion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      max_tokens: 512,
    });

    const response = chatCompletion.choices[0].message.content;
    console.log(response);
    return res.json({
      message: response,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(8000, () => {
  console.log("server running on " + 8000);
});
