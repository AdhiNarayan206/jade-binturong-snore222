import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { UserPlus } from "lucide-react";

interface InviteMemberDialogProps {
  teamId: string;
  onMemberInvited: () => void;
}

export function InviteMemberDialog({ teamId, onMemberInvited }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.functions.invoke('send-team-invite', {
      body: { teamId, email },
    });

    setLoading(false);

    if (error) {
      // The edge function returns a JSON with an 'error' key on failure.
      // The Supabase client puts this JSON response into the 'context' property of the error object.
      const functionError = (error as any).context?.error;
      
      // If we have a specific error from the function, use it. Otherwise, use the generic client error message.
      const detailedMessage = functionError || error.message;

      showError(`Failed to send invitation: ${detailedMessage}`);
      console.error("Edge function error details:", error);
    } else if (data.error) {
      // This handles cases where the function returns 200 OK but includes an error in the body.
      showError(`Failed to send invitation: ${data.error}`);
    } else {
      const successMessage = data.message || "Invitation sent successfully!";
      showSuccess(successMessage);
      onMemberInvited();
      setOpen(false);
      setEmail("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}