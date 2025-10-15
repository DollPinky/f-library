import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

export default function Forbidden() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-6 bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <ShieldX className="w-24 h-24 text-red-500" />
        <h1 className="text-5xl font-bold text-gray-800">
          <strong>403</strong>
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Access Forbidden
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          You don't have permission to access this resource. Please contact your
          administrator if you believe this is an error.
        </p>
      </div>
      <Link
        className="font-medium text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors shadow-md"
        to={'/'}
      >
        Back to Home
      </Link>
    </div>
  )
}
