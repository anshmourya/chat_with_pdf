"use client";
import Chat from "@/components/Chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Upload } from "lucide-react";
import { ChangeEvent } from "react";
export default function Home() {
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      const formData = new FormData();
      formData.append("file", file[0]);

      try {
        const data = await fetch(process.env.BACKEND_URL + "/upload", {
          method: "POST",
          body: formData,
        });
        const response = await data.json();
        console.log(response);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };
  return (
    <ResizablePanelGroup direction="horizontal" className="!h-dvh">
      <ResizablePanel>
        <div className="w-full h-full flex justify-center items-center bg-muted">
          <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg border">
            <Upload className="w-12 h-12 text-primary mb-2" />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow"
            >
              Upload PDF&apos;s{" "}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={uploadFile}
                accept="application/pdf"
              />
            </label>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <Chat />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
