import { useState, useEffect } from "react";
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
import { Session } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

const Account = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select(`full_name`)
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          showError("Could not fetch your profile.");
        } else if (data) {
          setFullName(data.full_name || "");
        }
      }
      setLoading(false);
    };

    getProfileData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      showError("You must be logged in to update your profile.");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", session.user.id);

      if (error) throw error;
      showSuccess("Profile updated successfully!");
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      <Card>
        <form onSubmit={handleUpdateProfile}>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Make changes to your public information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={session?.user?.email || ""} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Save changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Account;