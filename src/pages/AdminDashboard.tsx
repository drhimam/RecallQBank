import { AdminPanel } from "@/components/AdminPanel";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-4">
        Review and approve submitted questions.
      </p>
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;