

import { MapPin, Phone, Clock, Mail } from "lucide-react"



export function ClinicInfo() {



  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Visit Our Clinic</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">Sushma Infinium

Office 11 on 11th Floor, Zirakpur, Punjab 140603</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">+91 9815-34-0123</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">info@antheminfotech.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: Closed
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Location</h3>
            <div className="aspect-video rounded-md overflow-hidden">
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.8370940784007!2d76.82170797536911!3d30.638548374629888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feb34165bc719%3A0xeef887919eec714c!2sAnthem%20Infotech%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1748318812698!5m2!1sen!2sin"
  className="w-full h-[450px] border-0"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

            </div>

            <p className="mt-4 text-gray-600">
              We are conveniently located in the Medical District, with ample parking and easy access to public
              transportation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
