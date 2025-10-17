import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { documents } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DocumentDetail = () => {
  const { documentId } = useParams();
  const document = documents.find((d) => d.id === documentId);

  if (!document) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Document not found</h2>
        <p className="text-muted-foreground">
          The document you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link to="/documents">Back to Documents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <Button variant="outline" asChild>
        <Link to="/documents">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{document.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last modified: {document.lastModified}
          </p>
        </CardHeader>
        <CardContent>
          <article className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {document.content}
            </ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentDetail;