export default function About() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">About Our Clinic</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At HealthCare Clinic, our mission is to prov_ide exceptional healthcare services with compassion and
            expertise. We are committed to improving the health and wellbeing of our community through personalized care
            and advanced medical practices.
          </p>
          <p className="text-gray-700">
            Our team of dedicated healthcare professionals strives to deliver the highest standard of care in a
            comfortable and welcoming environment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="font-medium w-24">Address:</span>
              <span className="text-gray-700">123 Health Avenue, Medical District, City, State 12345</span>
            </p>
            <p className="flex items-start">
              <span className="font-medium w-24">Phone:</span>
              <span className="text-gray-700">(555) 123-4567</span>
            </p>
            <p className="flex items-start">
              <span className="font-medium w-24">Email:</span>
              <span className="text-gray-700">info@healthcareclinic.com</span>
            </p>
            <p className="flex items-start">
              <span className="font-medium w-24">Hours:</span>
              <span className="text-gray-700">
                Monday - Friday: 8:00 AM - 6:00 PM
                <br />
                Saturday: 9:00 AM - 1:00 PM
                <br />
                Sunday: Closed
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Our Services</h2>
        <ul className="grid md:grid-cols-2 gap-4 list-disc list-inside text-gray-700">
          <li>General Medical Consultations</li>
          <li>Preventive Health Screenings</li>
          <li>Chronic Disease Management</li>
          <li>Pediatric Care</li>
          <li>Women's Health Services</li>
          <li>Geriatric Care</li>
          <li>Vaccinations</li>
          <li>Health Education</li>
        </ul>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Insurance</h2>
        <p className="text-gray-700 mb-4">
          We accept most major insurance plans. Please contact our office to verify your insurance coverage before your
          appointment.
        </p>
        <p className="text-gray-700">
          For patients without insurance, we offer affordable self-pay options. Our staff is available to discuss
          payment plans and options.
        </p>
      </div>
    </div>
  )
}
