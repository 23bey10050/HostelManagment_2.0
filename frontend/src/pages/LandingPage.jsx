import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/90 to-blue-50/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">Hostel Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A comprehensive platform for managing hostel operations, complaints, and announcements.
            </p>
          </div>
        </div>
      </div>

      {/* Login Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Student Card */}
          <Link 
            to="/login/student"
            className="group bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Portal</h3>
            <p className="text-gray-600 mb-6">
              Access your hostel services, submit complaints, and view announcements.
            </p>
            <span className="text-blue-600 group-hover:text-blue-700">Login with Google →</span>
          </Link>

          {/* Staff/Warden Card */}
          <Link 
            to="/login/staff"
            className="group bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Staff Portal</h3>
            <p className="text-gray-600 mb-6">
              Manage hostel operations, handle complaints, and make announcements.
            </p>
            <span className="text-blue-600 group-hover:text-blue-700">Staff Login →</span>
          </Link>

          {/* Worker Card */}
          <Link 
            to="/login/worker"
            className="group bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Worker Portal</h3>
            <p className="text-gray-600 mb-6">
              View and manage assigned tasks and maintenance requests.
            </p>
            <span className="text-blue-600 group-hover:text-blue-700">Worker Login →</span>
          </Link>

          {/* Night Canteen Card - UPDATED */}
          <Link 
            to="/login/canteen"
            className="group bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Canteen Staff Portal</h3>
            <p className="text-gray-600 mb-6">
              For canteen staff only. Manage orders, menu items and track customer requests.
            </p>
            <span className="text-blue-600 group-hover:text-blue-700">Canteen Staff Login →</span>
          </Link>
        </div>

        {/* CTS Admin Link */}
        <div className="mt-16 text-center">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>CTS Admin Access</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">24/7</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support System</h3>
              <p className="text-gray-600">Quick and efficient response to student complaints</p>
            </div>
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">100%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Management</h3>
              <p className="text-gray-600">Paperless and efficient administrative processes</p>
            </div>
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">Real-time</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Updates</h3>
              <p className="text-gray-600">Instant notifications and status tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
