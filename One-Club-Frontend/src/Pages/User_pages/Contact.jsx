import ContactImage from '../../assets/contact.png';
import Title from '../../Components/User_components/Utils/Title';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Title Section */}
      <div className="text-center pt-5 text-lg">
        <Title text1="CONTACT" text2="US" />
        <p className="text-blue-600 mt-2">We'd love to hear from you!</p>
      </div>

      {/* Content Section */}
      <div className="my-16 flex flex-col md:flex-row items-center justify-center gap-12 px-4 md:px-20">
        {/* Image */}
        <div className="flex justify-center md:w-1/2">
          <img
            className="rounded-lg shadow-lg w-full md:max-w-[480px] hover:scale-105 transition-transform duration-300"
            src={ContactImage}
            alt="Contact"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center md:w-1/2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-2 text-blue-600">
              <FaMapMarkerAlt />
              <h2 className="text-xl font-semibold text-blue-600">Our Store</h2>
            </div>
            <p className="text-gray-600 ml-7">
              CDAC Hostel <br /> Bangalore, Karnataka
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-2 text-blue-600">
              <FaPhoneAlt />
              <h2 className="text-xl font-semibold text-blue-600">Call Us</h2>
            </div>
            <p className="text-gray-600 ml-7">+91-7017081742</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-2 text-blue-600">
              <FaEnvelope />
              <h2 className="text-xl font-semibold text-blue-600">Email</h2>
            </div>
            <p className="text-gray-600 ml-7">saahil4020@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
