import Image1 from "../../../assets/w2.png";
import Image2 from "../../../assets/shopping.png";
import Image3 from "../../../assets/sale.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Up to 50% Off on Women's Dresses!",
    description:
      "Explore our latest collection of women's casual dresses, featuring vibrant colors and comfortable fabrics perfect for everyday wear. From flowy maxis to chic midi dresses, find your style at unbeatable prices.",
    category: "Women's Clothing",
  },
  {
    id: 2,
    img: Image2,
    title: "Up to 35% Off on Summer Wear!",
    description:
      "Get ready for the beach with our stylish summer beachwear collection! Shop swimsuits, cover-ups, and accessories designed for comfort and flair, all at discounted prices for a limited time.",
    category: "Women's Clothing",
  },
  {
    id: 3,
    img: Image3,
    title: "Up to 70% Off on Clearance Sale!",
    description:
      "Don't miss our massive clearance sale! Grab incredible deals on a wide range of products, including clothing, accessories, and more. Shop now before these items are gone for good!",
    category: "Clearance",
  },
];


const Hero = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    fade: true, // Enable fade-in/fade-out effect
  };

  return (
    <div className=" relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-white flex justify-center items-center  duration-200 px-10">
      {/* background pattern */}
      <div className="h-[650px] w-[700px] bg-gradient-to-r from-blue-400 to-black absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
      {/* hero section */}
      <div className="container ">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 px-10">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <button
                      onClick={() => { }}
                      className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Coming Soon...
                    </button>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[325px] sm:w-[325px] sm:scale-115 lg:scale-140 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;