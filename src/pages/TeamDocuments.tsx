import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { documents as initialDocuments, Document, projects } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateDocumentDialog } from "@/components/CreateDocumentDialog";
import { UploadDocument } from "@/components/UploadDocument";

// NOTE: Since documents are not directly linked to teams in mockData, 
// we will temporarily link them via projects for demonstration purposes.
// For now, we will show all documents until a proper team association is implemented.
// In a real application, documents would have a teamId column.

const TeamDocuments = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  // In a real app, we would filter documents by teamId. 
  // Since mock data doesn't have doc.teamId, we show all for now.
  const teamDocuments = documents; 

  const handleDocumentCreated = (newDocument: Document) => {
    setDocuments((prev) => [...prev, newDocument]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-muted-foreground">
            Collaborate on documents for this team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UploadDocument onDocumentUploaded={handleDocumentCreated} />
          <CreateDocumentDialog onDocumentCreated={handleDocumentCreated} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamDocuments.map((doc) => (
          <Link
            // We need to ensure the link goes back to the team context if needed, 
            // but for now, we use the global document detail route.
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
      {teamDocuments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No documents found for this team.
        </div>
      )}
    </div>
  );
};

export default TeamDocuments;