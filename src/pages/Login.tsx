import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";

const Login = () => {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gray-100 lg:flex items-center justify-center dark:bg-gray-800">
        <div className="text-center">
          <Package className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold">CollabMate</h1>
          <p className="text-muted-foreground mt-2">
            Your All-In-One Collaboration Hub
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome !</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to access your projects and tasks
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            // providers={["github"]}
            providers={[]}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;