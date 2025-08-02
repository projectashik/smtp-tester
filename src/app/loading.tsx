import { Mail } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg animate-pulse">
            <Mail className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Loading SMTP Tester
        </h2>
        <p className="text-gray-600 mb-6">
          Preparing your professional email testing environment...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
}
