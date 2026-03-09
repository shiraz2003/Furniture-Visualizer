import React, { useState } from "react";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoCartOutline,
} from "react-icons/io5";
import {
  MdOutlineChair,
  MdOutlineTableBar,
  MdOutlineBed,
} from "react-icons/md";
import { TbSofa, TbLamp } from "react-icons/tb";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("Chair");

  const categories = [
    { name: "Chair", icon: <MdOutlineChair size={40} />, items: 200 },
    { name: "Sofa", icon: <TbSofa size={40} />, items: 240 },
    { name: "Table", icon: <MdOutlineTableBar size={40} />, items: 140 },
    { name: "Bed", icon: <MdOutlineBed size={40} />, items: 340 },
    { name: "Lamp", icon: <TbLamp size={40} />, items: 440 },
  ];

  const popularProducts = [
    {
      name: "Armless Solid Dining Chair",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?w=240&h=240&fit=crop",
    },
    {
      name: "Elle Decor Roux Arm Chair",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=240&h=240&fit=crop",
    },
    {
      name: "Elle Decor Roux Arm Chair",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=240&h=240&fit=crop",
    },
    {
      name: "Elle Decor Roux Arm Chair",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=240&h=240&fit=crop",
    },
  ];

  const latestProducts = [
    {
      name: "Velvet Midnight Natural Sofa",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=240&h=240&fit=crop",
    },
    {
      name: "Modern Furniture",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=240&h=240&fit=crop",
    },
    {
      name: "Modern Furniture Set",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=240&h=240&fit=crop",
    },
    {
      name: "Furniture Sofa Set",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=240&h=240&fit=crop",
    },
  ];

  const allProductsRow1 = [
    {
      name: "Modern Table Collection",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=240&h=240&fit=crop",
    },
    {
      name: "Luxury Gold Accent Table",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=240&h=240&fit=crop",
    },
    {
      name: "Classic Table Collection",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=240&h=240&fit=crop",
    },
    {
      name: "Furniture & Dining Sets",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=240&h=240&fit=crop",
    },
  ];

  const allProductsRow2 = [
    {
      name: "Losh Design Lamp",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=240&h=240&fit=crop",
    },
    {
      name: "Ofula Glass Lamp",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=240&h=240&fit=crop",
    },
    {
      name: "Best Bedroom Lamp",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=240&h=240&fit=crop",
    },
    {
      name: "Furniture & Dining Sets",
      price: "1,250.00",
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=240&h=240&fit=crop",
    },
  ];

  const ProductCard = ({ product }) => (
    <div className="w-[308px] h-[440px] bg-[#F6FBFF] shadow-[0_0_16px_rgba(0,0,0,0.25)] rounded-[10px] relative flex-shrink-0">
      <div className="flex justify-center mt-[30px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-[240px] h-[240px] object-cover rounded-md"
        />
      </div>
      <p className="font-kufam font-normal text-[20px] leading-[26px] text-black text-center mt-[14px]">
        {product.name}
      </p>
      <p className="font-kufam font-normal text-[20px] leading-[26px] text-black text-center mt-[14px]">
        Price: ৳{product.price}
      </p>
      <div className="flex justify-center mt-[14px]">
        <button className="w-[246px] h-[46px] bg-[#527A9A] rounded-[2px] flex items-center justify-center gap-[10px] cursor-pointer hover:bg-[#456a87] transition-colors">
          <span className="font-kufam font-normal text-[20px] leading-[26px] text-white">
            Add to Cart
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5]">
      {/* ===== NAVBAR ===== */}
      <nav
        className="w-full h-[80px] relative z-50"
        style={{ filter: "drop-shadow(0px 0px 16px rgba(0, 0, 0, 0.25))" }}
      >
        <div className="max-w-[1440px] mx-auto h-full flex items-center px-[50px] relative">
          

          {/* Nav Links - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[56px]">
            {["Home", "Products", "About", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-montserrat font-normal text-[18px] leading-[22px] text-white hover:opacity-80 transition-opacity"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="ml-auto flex items-center gap-0">
            <button className="flex items-center gap-[4px] px-[10px] py-[10px] cursor-pointer">
              <IoSearchOutline size={20} className="text-white" />
              <span className="font-montserrat font-normal text-[18px] leading-[22px] text-white">
                Search
              </span>
            </button>
            <button className="flex items-center gap-[4px] px-[10px] py-[10px] cursor-pointer">
              <IoPersonOutline size={20} className="text-white" />
              <span className="font-montserrat font-normal text-[18px] leading-[22px] text-white">
                Account
              </span>
            </button>
            <button className="flex items-center gap-[4px] px-[10px] py-[10px] cursor-pointer">
              <IoCartOutline size={20} className="text-white" />
              <span className="font-montserrat font-normal text-[18px] leading-[22px] text-white">
                Cart
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        className="w-full h-[616px] -mt-[80px] relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1440&h=696&fit=crop')`,
        }}
      >
        <h1 className="font-kufam font-medium text-[48px] leading-[62px] text-center text-[#F5F5F5] max-w-[824px] px-4">
          Elevate Your Home Decor with Our Premium Furniture Collection
        </h1>
        <button className="mt-[18px] w-[192px] h-[59px] bg-white rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="font-kufam font-medium text-[24px] leading-[31px] text-black">
            Contact Us
          </span>
        </button>
      </section>

      {/* ===== CATEGORY SECTION ===== */}
      <section className="max-w-[1440px] mx-auto pt-[40px] pb-[40px]">
        <h2 className="font-kufam font-medium text-[24px] leading-[31px] text-black text-center mb-[40px]">
          Category
        </h2>
        <div className="flex justify-center gap-[25px] px-[50px]">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`w-[248px] h-[162px] rounded-[10px] flex flex-col items-center justify-center cursor-pointer transition-colors
                ${
                  activeCategory === cat.name
                    ? "bg-[#527A9A] text-white shadow-[0_0_16px_rgba(9,43,66,0.25)]"
                    : "bg-[#F7FBFF] text-black shadow-[0_0_16px_rgba(9,43,66,0.25)]"
                }`}
            >
              <div
                className={`text-[40px] mb-[6px] ${activeCategory === cat.name ? "text-white" : "text-[#092B42]"}`}
              >
                {cat.icon}
              </div>
              <p className="font-kufam font-medium text-[20px] leading-[26px]">
                {cat.name}
              </p>
              <p className="font-kufam font-normal text-[14px] leading-[18px] mt-[6px]">
                {cat.items} Item Available
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== POPULAR PRODUCT ===== */}
      <section className="max-w-[1440px] mx-auto px-[50px] pb-[40px]">
        <div className="flex justify-between items-center mb-[40px]">
          <h2 className="font-kufam font-medium text-[24px] leading-[31px] text-black">
            Popular Product
          </h2>
          <a
            href="#"
            className="font-kufam font-normal text-[20px] leading-[26px] text-black hover:underline"
          >
            See all
          </a>
        </div>
        <div className="flex justify-between">
          {popularProducts.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </section>

      {/* ===== LATEST PRODUCT ===== */}
      <section className="max-w-[1440px] mx-auto px-[50px] pb-[40px]">
        <div className="flex justify-between items-center mb-[40px]">
          <h2 className="font-kufam font-medium text-[24px] leading-[31px] text-black">
            Latest Product
          </h2>
          <a
            href="#"
            className="font-kufam font-normal text-[20px] leading-[26px] text-black hover:underline"
          >
            See all
          </a>
        </div>
        <div className="flex justify-between">
          {latestProducts.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </section>

      {/* ===== PROMO BANNERS ===== */}
      <section className="max-w-[1440px] mx-auto px-[50px] pb-[40px]">
        <div className="flex gap-[40px]">
          {/* Left Banner */}
          <div
            className="w-[650px] h-[340px] relative rounded-md overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=650&h=340&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-white/20"></div>
            <div className="relative z-10 p-[40px]">
              <p className="font-kufam font-medium text-[16px] leading-[21px] text-[#092B42] mb-[10px]">
                Up to 25% Discount
              </p>
              <h3 className="font-kufam font-medium text-[24px] leading-[31px] text-[#092B42] max-w-[325px]">
                Explore Our Luxurious Sofa Set Collection
              </h3>
              <button className="mt-[10px] w-[119px] h-[41px] bg-[#092B42] rounded-[2px] flex items-center justify-center cursor-pointer hover:bg-[#0a3654] transition-colors">
                <span className="font-kufam font-medium text-[16px] leading-[21px] text-white">
                  Shop Now
                </span>
              </button>
            </div>
          </div>

          {/* Right Banner */}
          <div
            className="w-[650px] h-[340px] relative rounded-md overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=650&h=340&fit=crop')`,
            }}
          >
            <div className="relative z-10 p-[40px]">
              <p className="font-kufam font-medium text-[16px] leading-[21px] text-[#42FF00] mb-[6px]">
                20% Discount
              </p>
              <h3 className="font-kufam font-medium text-[24px] leading-[31px] text-white max-w-[267px]">
                New Combo Collection
              </h3>
              <button className="mt-[10px] w-[119px] h-[41px] bg-white rounded-[2px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-kufam font-medium text-[16px] leading-[21px] text-[#092B42]">
                  Shop Now
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ALL PRODUCT ===== */}
      <section className="max-w-[1440px] mx-auto px-[50px] pb-[40px]">
        <div className="flex justify-between items-center mb-[40px]">
          <h2 className="font-kufam font-medium text-[24px] leading-[31px] text-black">
            All Product
          </h2>
          <a
            href="#"
            className="font-kufam font-normal text-[20px] leading-[26px] text-black hover:underline"
          >
            See all
          </a>
        </div>
        {/* Row 1 */}
        <div className="flex justify-between mb-[40px]">
          {allProductsRow1.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex justify-between">
          {allProductsRow2.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="w-full"
        style={{ background: "rgba(82, 122, 154, 0.41)" }}
      >
        <div className="max-w-[1440px] mx-auto px-[50px] py-[50px]">
          <div className="grid grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h4 className="font-kufam font-medium text-[24px] leading-[31px] text-black mb-[12px]">
                Company
              </h4>
              <ul className="space-y-[8px]">
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Career
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-kufam font-medium text-[24px] leading-[31px] text-black mb-[12px]">
                Contact
              </h4>
              <ul className="space-y-[8px]">
                <li className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F]">
                  Address: Mohammadpur, Dhaka
                </li>
                <li className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F]">
                  Phone: ++88012345678976
                </li>
                <li className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F]">
                  Email- info@shop.com
                </li>
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h4 className="font-kufam font-medium text-[24px] leading-[31px] text-black mb-[12px]">
                Important Links
              </h4>
              <ul className="space-y-[8px]">
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Shop
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Terms & Condition
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-kufam font-medium text-[24px] leading-[31px] text-black mb-[12px]">
                Follow Us
              </h4>
              <ul className="space-y-[8px]">
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-kufam font-normal text-[20px] leading-[26px] text-[#312F2F] hover:underline"
                  >
                    Youtube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
