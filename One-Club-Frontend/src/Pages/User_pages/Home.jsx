import { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../Components/User_components/Home_components/Hero';
import Testimonials from '../../Components/User_components/Home_components/Testimonials';
import ChatBot from 'react-chatbotify';
import { FaComment } from 'react-icons/fa';

// 🔹 Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4">
          Something went wrong with the chatbot. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = () => {
  const navigate = useNavigate();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const categories = [
    { title: 'Clothing', image: '/images/cloth.avif' },
    { title: 'Electronics', image: '/images/trend5.webp' },
    { title: 'Jewellery', image: '/images/jewellery.webp' },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/collections?category=${encodeURIComponent(category)}`);
  };

  // 🔹 ChatBot Flow for v2.x
  const flow = {
    start: {
      message: '👋 Hi! Welcome to OneClub. How can I assist you today?',
      path: 'options',
      delay: 500,
    },
    options: {
      message: 'You can choose an option or type a category (e.g., Clothing, Electronics, Jewellery):',
      options: [
        { text: 'Browse Categories 🛍️', value: 'categories' },
        { text: 'Contact Support 📞', value: 'support' },
        { text: 'Latest Offers 🎉', value: 'offers' },
      ],
      input: {
        type: 'text',
        path: (input) => {
          console.log('User input:', input); // Debug log
          const normalizedInput = input.trim().toLowerCase();
          if (['clothing', 'electronics', 'jewellery'].includes(normalizedInput)) {
            return normalizedInput;
          }
          return 'invalid_input';
        },
      },
    },
    categories: {
      message: 'We have Clothing, Electronics, and Jewellery. Which would you like to explore?',
      options: [
        { text: 'Clothing', value: 'clothing' },
        { text: 'Electronics', value: 'electronics' },
        { text: 'Jewellery', value: 'jewellery' },
      ],
    },
    clothing: {
      message: '👕 Redirecting you to Clothing...',
      callback: () => {
        console.log('Navigating to Clothing'); // Debug log
        navigate('/collections?category=Clothing');
      },
      end: true,
    },
    electronics: {
      message: '📱 Redirecting you to Electronics...',
      callback: () => {
        console.log('Navigating to Electronics'); // Debug log
        navigate('/collections?category=Electronics');
      },
      end: true,
    },
    jewellery: {
      message: '💍 Redirecting you to Jewellery...',
      callback: () => {
        console.log('Navigating to Jewellery'); // Debug log
        navigate('/collections?category=Jewellery');
      },
      end: true,
    },
    support: {
      message: '📩 You can reach our support team at support@oneclub.com',
      end: true,
    },
    offers: {
      message: '🎁 Check out our latest offers on the homepage banners!',
      end: true,
    },
    invalid_input: {
      message: "Sorry, I didn't recognize that category. Please choose from Clothing, Electronics, or Jewellery, or select an option below:",
      path: 'options',
    },
  };

  // 🔹 Theme for ChatBot
  const theme = {
    primaryColor: '#111827',
    secondaryColor: '#facc15',
    backgroundColor: '#f9fafb',
    fontFamily: 'Poppins, sans-serif',
    header: {
      bgColor: '#000000',
      textColor: '#ffffff',
    },
    botBubble: {
      bgColor: '#2563eb',
      textColor: '#ffffff',
    },
    userBubble: {
      bgColor: '#facc15',
      textColor: '#111827',
    },
  };

  return (
    <div className="font-sans text-black">
      {/* HERO BANNER */}
      <Hero />

      {/* 🔹 ChatBot Toggle Button */}
      <button
        onClick={() => setIsChatBotOpen(!isChatBotOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-gray-500 to-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label={isChatBotOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        <FaComment size={24} />
      </button>

      {/* 🔹 ChatBot Integration with Error Boundary */}
      {isChatBotOpen && (
        <div className="fixed bottom-16 right-6 z-50 w-80 md:w-96 max-w-[90vw]" data-aos="fade-up" data-aos-delay="200">
          <ErrorBoundary>
            <ChatBot
              flow={flow}
              theme={theme}
              settings={{
                voice: false,
                showHeader: true,
                showFooter: true,
                showTypingIndicator: true,
                headerTitle: 'OneClub Assistant',
                autoOpen: false,
              }}
            />
          </ErrorBoundary>
        </div>
      )}

      {/* SHOP BY CATEGORIES */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p
              data-aos="fade-up"
              className="text-sm font-semibold text-blue-600 uppercase tracking-wide"
            >
              Explore Our Collections
            </p>
            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl font-extrabold text-gray-900 mt-2"
            >
              Shop by Category
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-base text-gray-600 mt-4 leading-relaxed"
            >
              Browse our wide range of products tailored to your needs and interests.
            </p>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="300"
            className="flex justify-center gap-6 flex-wrap"
          >
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="w-80 md:w-80 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleCategoryClick(cat.title)}
              >
                <img
                  src={cat.image}
                  alt={`${cat.title} category`}
                  className="w-full h-48 object-contain bg-gray-100 p-4"
                />
                <div className="text-center p-2">
                  <p className="text-lg font-semibold text-gray-900">{cat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />
    </div>
  );
};

export default Home;