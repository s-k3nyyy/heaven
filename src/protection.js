import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import LoadingPage from './components/loadingPage'

const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <LoadingPage />;

  return isSignedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;