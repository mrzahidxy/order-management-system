import { FiFacebook, FiInstagram, FiLinkedin, FiMapPin, FiShoppingCart } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="bg-blue-100 py-10">
      <div className="container">
        <div className="space-y-4 md:grid md:grid-cols-3 gap-4">
          {/** Column 1 */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center text-2xl text-blue-500 font-semibold mb-2"><FiShoppingCart className=" text-red-500"/> BuyNow</div>
            <div className="text-sm">
              © {new Date().getFullYear()} BuyNow LLC All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              <FiMapPin /> Dhaka, Bangladesh
            </div>
            <div className="flex flex-row items-center gap-2">
              <span>Follow us on: </span>
              <FiFacebook className="cursor-pointer hover:text-blue-500 transition ease-in-out" />
              <FiInstagram className="cursor-pointer hover:text-blue-500 transition ease-in-out" />
              <FiLinkedin className="cursor-pointer hover:text-blue-500 transition ease-in-out" />
            </div>
          </div>

          {/** Column 2 */}
          <div>
            <ul className="flex gap-8 font-semibold mb-4">
              <FooterLink text="Terms of Use" />
              <FooterLink text="Privacy" />
              <FooterLink text="Contact Us" />
            </ul>
            <div className="text-xs">
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque dolorem dolorum explicabo consectetur ut magnam voluptatibus voluptatum ullam pariatur labore.
            </div>
          </div>

          {/** Column 3 */}
          <div className="mx-auto">
            <ul className="font-semibold">
              <FooterLink text="About Us" />
              <FooterLink text="Trending Products" />
              <FooterLink text="Top Search" />
              <FooterLink text="Drop A Review" />
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ text }: { text: string }) => (
  <li className="cursor-pointer underline">{text}</li>
);

export default Footer;
