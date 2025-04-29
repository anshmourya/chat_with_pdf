import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export const vectorStore = new QdrantVectorStore(
  new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGING_FACE_API,
  }),
  {
    url: "http://localhost:6333",
    collectionName: "pdf-docs",
  }
);

const worker = new Worker(
  "fileQueue",
  async (job) => {
    try {
      const data = JSON.parse(job.data);
      const loader = new PDFLoader(data.path);
      const docs = await loader.load();
      const splitter = new CharacterTextSplitter({
        separator: " ",
        chunkSize: 300,
        chunkOverlap: 0,
      });

      const text = await splitter.splitDocuments(docs);

      await vectorStore.addDocuments(text);
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
