import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12">
        <div className="text-center max-w-xl px-4">
          <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-400">Welcome to recallQbank</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            A collaborative, not-for-profit question bank for medical postgraduates and licensing exam candidates. Contribute, study, and discuss recall exam questions for MRCP, MRCS, FCPS, MD, MS, FRCR, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/qbank"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105"
            >
              Explore Qbank
            </Link>
            <Link
              to="/submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
            >
              Submit a Question
            </Link>
          </div>
        </div>
        <div className="mt-12">
          <MadeWithDyad />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;