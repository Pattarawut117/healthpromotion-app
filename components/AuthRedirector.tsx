"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLiff } from "@/contexts/LiffContext";

const AuthRedirector = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, profile } = useLiff();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (isLoggedIn && profile?.userId) {
        try {
          const response = await fetch(`/api/users?user_id=${profile.userId}`);
          if (response.ok) {
            // User exists, redirect to home
            router.push("/");
          } else if (response.status === 404) {
            // User does not exist, redirect to register
            router.push("/user/register");
          } else {
            // Handle other API errors
            console.error("API error:", response.statusText);
            // Optionally, redirect to an error page or home
            router.push("/");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          // Optionally, redirect to an error page or home
          router.push("/");
        } finally {
          setIsLoading(false);
        }
      } else if (!isLoggedIn) {
        // If not logged in, wait for LIFF to initialize and log in
        // The LiffContext handles the liff.login() call
        setIsLoading(true); // Keep loading until LIFF is ready
      }
    };

    checkUserAndRedirect();
  }, [isLoggedIn, profile, router]);

  if (isLoading) {
    // You can render a loading spinner or a blank page here
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthRedirector;
