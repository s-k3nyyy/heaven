import { useEffect } from 'react';
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";

const Googlecallback = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      if (user.firstName && user.lastName) {
        window.location.href = "/home";
      }
    }
  }, [user]);
  
  return (
    <div>
    
      <AuthenticateWithRedirectCallback 
        signUpFallbackRedirectUrl="/home"
        signInFallbackRedirectUrl="/home"
        onError={(error) => {
          console.error("Authentication Error:", error);
        }}
      />
    </div>
  );
};

export default Googlecallback;