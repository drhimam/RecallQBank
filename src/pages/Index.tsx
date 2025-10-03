import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to recallQbank</h1>
        <p className="text-xl text-gray-700 mb-6">
          A collaborative, not-for-profit question bank for medical postgraduates and licensing exam candidates. Contribute, study, and discuss recall exam questions for MRCP, MRCS, FCPS, MD, MS, FRCR, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/qbank"
            className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Explore Qbank
          </Link>
          <Link
            to="/submit"
            className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          >
            Submit a Question
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;