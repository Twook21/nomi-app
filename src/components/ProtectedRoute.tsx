"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["USER", "PARTNER", "ADMIN"],
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
    } 
    else if (user && !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (isAuthenticated && user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <LoadingSpinner />; 
};

export default ProtectedRoute;