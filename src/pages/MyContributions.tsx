import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyContributions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the submit page which now includes contributions
    navigate("/submit");
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
      <p className="text-gray-600">
        Taking you to the new combined submission and contributions page.
      </p>
    </div>
  );
};

export default MyContributions;