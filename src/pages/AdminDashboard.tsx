import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ModeratorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile page with moderation tab
    navigate("/profile");
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
      <p className="text-gray-600">
        Taking you to your profile page where you can access moderation tools.
      </p>
    </div>
  );
};

export default ModeratorDashboard;