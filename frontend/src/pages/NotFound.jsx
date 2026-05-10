import { Link } from 'react-router-dom';
import { GraduationCap, Home, ArrowLeft, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(243,244,246,1))] flex flex-col">
      <header className="px-6 py-5 sm:px-10">
        <Link to="/" className="flex w-fit items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/10">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Campus Hub</div>
            <div className="font-semibold text-gray-900">Return to campus</div>
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-14">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <Compass className="h-11 w-11 text-gray-900" />
          </div>

          <div className="mb-4 text-8xl font-black tracking-tight text-gray-900 sm:text-9xl">
            404
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            The page you tried to open does not exist or was moved. Use one of the shortcuts below to get back to the parts of Campus Hub you need.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-gray-800"
            >
              <Home className="h-5 w-5" />
              Go to dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:border-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to home
            </Link>
          </div>

          <div className="mt-12 rounded-3xl border border-gray-200 bg-white/90 p-6 text-left shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Search className="h-4 w-4 text-gray-500" />
              Try one of these destinations
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace" className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200">
                Marketplace
              </Link>
              <Link to="/study-groups" className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200">
                Study Groups
              </Link>
              <Link to="/messages" className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200">
                Messages
              </Link>
              <Link to="/campus-maps" className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200">
                Campus Maps
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}