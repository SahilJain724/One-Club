import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Testimonial data array
const TestimonialData = [
  {
    id: 1,
    name: "Emma Johnson",
    text: "Absolutely wonderful experience! The quality and service exceeded my expectations.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Hiroshi Tanaka",
    text: "Fast delivery and great customer support. I highly recommend this store!",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Amara Singh",
    text: "A seamless shopping experience. Will definitely come back for more!",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "Luca Moretti",
    text: "Fantastic product range and easy checkout process. Five stars!",
    img: "https://picsum.photos/103/103",
  },
];

// Slider settings for responsive carousel
const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  cssEase: "linear",
  pauseOnHover: true,
  pauseOnFocus: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p
            data-aos="fade-up"
            className="text-sm font-semibold text-blue-600 uppercase tracking-wide"
          >
            What Our Customers Say
          </p>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl font-extrabold text-gray-900 mt-2"
          >
            Testimonials
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-base text-gray-600 mt-4 leading-relaxed"
          >
            Discover why our customers love us. Read their experiences and see
            what makes us stand out.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div data-aos="zoom-in" data-aos-delay="300">
          <Slider {...sliderSettings}>
            {TestimonialData.map((data) => (
              <div key={data.id} className="px-4 py-6">
                <div className="relative flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Quotation Mark */}
                  <span className="absolute top-4 right-4 text-6xl text-blue-200 font-serif opacity-50">
                    ,,
                  </span>

                  {/* Testimonial Content */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={data.img}
                      alt={`${data.name}'s profile`}
                      className="w-25 rounded-full object-cover border-2 border-blue-100 mb-4"
                    />
                    <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
                      {data.text}
                    </p>
                    <h2 className="text-lg font-semibold text-gray-900 mt-4">
                      {data.name}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;