import Link from "next/link";
import { Mail, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
            <Mail className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back to testing your SMTP configuration.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Go to SMTP Tester</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Need Help with SMTP Testing?
          </h3>
          <p className="text-sm text-blue-800">
            Our SMTP tester supports Gmail, Outlook, SendGrid, Mailgun, and all major email providers with real-time diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
}
