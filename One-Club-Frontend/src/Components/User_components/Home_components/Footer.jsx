import oneClubTrans from "../../../assets/oneClubtrans.png";
import BannerImg from "../../../assets/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/Contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];

const Footer = () => {
  return (
    <div
      className="text-white"
      style={{
        backgroundImage: `url(${BannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 95%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-25">
          {/* company details */}
          <div className="px-15 py-12">
            <img src={oneClubTrans} alt="One Club" className=" w-20 rounded-3xl cursor-pointer transform scale-225" />
            
          </div>


          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.link}
                        className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.link}
                        className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* social links */}
            <div>
              <div className="flex items-center gap-3 mt-6">
                <a className="hover:scale-125" href="#">
                  <FaInstagram className="text-3xl" />
                </a>
                <a href="#">
                  <FaFacebook className="hover:scale-125 text-3xl" />
                </a>
                <a href="#">
                  <FaLinkedin className="hover:scale-125 text-3xl" />
                </a>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <FaLocationArrow />
                  <p>Bangalore, Karnataka</p>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <FaMobileAlt />
                  <p>+91 7017081742</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
