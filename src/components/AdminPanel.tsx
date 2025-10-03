export const AdminPanel = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-2">Moderation Tools</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-2">
        <li>Approve or reject submitted questions</li>
        <li>View flagged/duplicate questions</li>
        <li>Manage user roles (admin, co-admin, contributor)</li>
      </ul>
      <div className="text-sm text-gray-500">* Full functionality coming soon.</div>
    </div>
  );
};