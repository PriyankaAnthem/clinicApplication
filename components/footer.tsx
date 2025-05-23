import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthCare Clinic</h3>
            <p className="text-gray-600 mb-4">Providing quality healthcare services to our community since 2005.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-gray-600 hover:text-blue-600 transition-colors">
                  View Appointments
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600">
              <p>123 Health Avenue</p>
              <p>Medical District, City 12345</p>
              <p className="mt-2">Phone: (555) 123-4567</p>
              <p>Email: info@healthcareclinic.com</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} <a href="https://www.antheminfotech.com" target="_blank" rel="noopener noreferrer">
  Anthem Infotech Pvt. Ltd.
</a> All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
