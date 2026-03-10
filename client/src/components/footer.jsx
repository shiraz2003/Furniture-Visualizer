export default function Footer() {
  return (
    <footer className="w-full bg-primary/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[25px] lg:px-[50px] py-[25px] sm:py-[35px] lg:py-[50px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {/* Company */}
          <div>
            <h4 className="font-kufam font-medium text-[18px] sm:text-[20px] lg:text-[24px] leading-tight text-primary mb-[8px] sm:mb-[10px] lg:mb-[12px]">
              Company
            </h4>
            <ul className="space-y-[6px] sm:space-y-[7px] lg:space-y-[8px]">
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Career
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-kufam font-medium text-[18px] sm:text-[20px] lg:text-[24px] leading-tight text-primary mb-[8px] sm:mb-[10px] lg:mb-[12px]">
              Contact
            </h4>
            <ul className="space-y-[6px] sm:space-y-[7px] lg:space-y-[8px]">
              <li className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70">
                Address: Mohammadpur, Dhaka
              </li>
              <li className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70">
                Phone: ++88012345678976
              </li>
              <li className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70">
                Email: info@shop.com
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-kufam font-medium text-[18px] sm:text-[20px] lg:text-[24px] leading-tight text-primary mb-[8px] sm:mb-[10px] lg:mb-[12px]">
              Important Links
            </h4>
            <ul className="space-y-[6px] sm:space-y-[7px] lg:space-y-[8px]">
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Terms & Condition
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-kufam font-medium text-[18px] sm:text-[20px] lg:text-[24px] leading-tight text-primary mb-[8px] sm:mb-[10px] lg:mb-[12px]">
              Follow Us
            </h4>
            <ul className="space-y-[6px] sm:space-y-[7px] lg:space-y-[8px]">
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-primary/70 hover:text-secondary hover:underline transition-colors"
                >
                  Youtube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-[20px] sm:mt-[25px] lg:mt-[30px] pt-[15px] sm:pt-[20px] lg:pt-[25px] border-t border-primary/20">
          <p className="text-center font-kufam font-normal text-[14px] sm:text-[15px] lg:text-[16px] text-primary/60">
            © 2024 Furniture Visualizer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
