import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyContributions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile page with contributions tab
    navigate("/profile");
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
      <p className="text-gray-600">
        Taking you to your profile page where you can view your contributions.
      </p>
    </div>
  );
};

export default MyContributions;