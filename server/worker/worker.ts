import { Worker, Job, tryCatch } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { QdrantClient } from "@qdrant/js-client-rest";
const filteWorket = new Worker(
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

      const text = await splitter.createDocuments([docs[0].pageContent]);
      const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: "",
      });

      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: "http://localhost:6333",
          collectionName: "pdf-docs",
        }
      );

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
