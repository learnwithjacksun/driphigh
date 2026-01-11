import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!user) {
        const authUser = await checkAuth();
        if (!authUser) {
          setIsChecking(false);
        } else {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [user, checkAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

