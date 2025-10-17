import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";

export const ResendTestCard = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError("Please enter an email address.");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.functions.invoke('test-resend', {
      body: { to_email: email },
    });

    setLoading(false);

    if (error) {
      const errorMessage = (error as any).context?.error?.message || error.message;
      showError(`Failed to send email: ${errorMessage}`);
    } else if (data.error) {
      showError(`Failed to send email: ${data.error}`);
    } else {
      showSuccess(`Test email sent to ${email}!`);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSendTestEmail}>
        <CardHeader>
          <CardTitle>Test Email Sending</CardTitle>
          <CardDescription>
            Verify that your Resend integration is working correctly by sending a test email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label htmlFor="test-email">Recipient Email</Label>
            <Input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Test Email"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};