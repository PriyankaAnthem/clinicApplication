
import { Calendar, Clock, Users, ClipboardCheck } from "lucide-react"


export function Features() {



  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">Book appointments online at your convenience, 24/7.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Hours</h3>
            <p className="text-gray-600">We offer extended hours to accommodate your busy schedule.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
            <p className="text-gray-600">Our team of specialists prov_ides comprehensive care.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Appointment Management</h3>
            <p className="text-gray-600">View and manage your appointments with ease.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
