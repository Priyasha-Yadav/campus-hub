import { Link } from 'react-router-dom';
import { GraduationCap, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Campus Hub</span>
        </Link>
      </header>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          {/* Large 404 */}
          <div className="text-9xl font-bold text-black mb-8 select-none">
            404
          </div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-12">
            Looks like you've wandered off campus! The page you're looking for doesn't exist.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          {/* Search Suggestion */}
          <div className="mt-12 p-6 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Looking for something specific?</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/marketplace" className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                Marketplace
              </Link>
              <Link to="/study-groups" className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                Study Groups
              </Link>
              <Link to="/messages" className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                Messages
              </Link>
              <Link to="/campus-maps" className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                Campus Maps
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}