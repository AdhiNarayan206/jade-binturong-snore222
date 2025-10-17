import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const Header = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="flex items-center justify-end p-4 border-b gap-4">
      <ThemeToggle />
      <Button variant="outline" size="icon" onClick={handleSignOut}>
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Sign Out</span>
      </Button>
    </header>
  );
};

export default Header;