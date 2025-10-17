import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { addDocument, Document } from "@/data/mockData";
import { showSuccess, showError } from "@/utils/toast";
import { Upload } from "lucide-react";

interface UploadDocumentProps {
  onDocumentUploaded: (newDocument: Document) => void;
}

export function UploadDocument({ onDocumentUploaded }: UploadDocumentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.endsWith('.md')) {
        showError("Please upload a Markdown (.md) file.");
        return;
    }

    try {
      const content = await file.text();
      const title = file.name.replace(/\.md$/, ''); // Remove .md extension for title
      
      const newDocument = addDocument({ title, content });
      onDocumentUploaded(newDocument);
      showSuccess("Document uploaded successfully!");
    } catch (error) {
      console.error("Error reading file:", error);
      showError("Failed to read the document file.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".md"
      />
      <Button onClick={handleUploadClick} variant="outline">
        <Upload className="mr-2 h-4 w-4" />
        Upload Document
      </Button>
    </>
  );
}