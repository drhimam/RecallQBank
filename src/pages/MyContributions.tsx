const MyContributions = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">My Contributions</h1>
      <p className="text-gray-600 mb-4">
        View and manage the questions you have submitted.
      </p>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="text-gray-500 text-center">
          (Your submitted questions will appear here.)
        </div>
      </div>
    </div>
  );
};

export default MyContributions;