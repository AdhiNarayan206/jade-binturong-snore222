import { useState } from "react";
import { Link } from "react-router-dom";
import { documents as initialDocuments, Document } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateDocumentDialog } from "@/components/CreateDocumentDialog";
import { UploadDocument } from "@/components/UploadDocument";

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const handleDocumentCreated = (newDocument: Document) => {
    setDocuments((prev) => [...prev, newDocument]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Collaborate on documents and track changes seamlessly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UploadDocument onDocumentUploaded={handleDocumentCreated} />
          <CreateDocumentDialog onDocumentCreated={handleDocumentCreated} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Link
            to={`/documents/${doc.id}`}
            key={doc.id}
            className="block hover:shadow-lg transition-shadow rounded-lg"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {doc.content}
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Last modified: {doc.lastModified}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Documents;