import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fbfbfe] pt-20 pb-10 border-t border-[#dedcff]/60 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
                <span className="text-4xl font-black tracking-tight text-[#050315]">
                    Design<span className="text-[#FBBF24]">Lab.</span>
                </span>
            </Link>
            <p className="text-sm font-medium text-[#050315]/60 leading-relaxed max-w-sm mb-8">
              Transforming houses into dream homes with our premium curated furniture collection and innovative 3D room visualization technology.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-[#dedcff]/50 flex items-center justify-center text-[#050315] hover:bg-[#050315] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <FaFacebookF size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-[#dedcff]/50 flex items-center justify-center text-[#050315] hover:bg-[#050315] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <FaInstagram size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-[#dedcff]/50 flex items-center justify-center text-[#050315] hover:bg-[#050315] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <FaTwitter size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-xl bg-[#dedcff]/50 flex items-center justify-center text-[#050315] hover:bg-[#050315] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-black text-lg text-[#050315] mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Story', path: '/story' },
                { name: 'Careers', path: '/careers' },
                { name: 'Press', path: '/press' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm font-medium text-[#050315]/60 hover:text-[#050315] transition-colors relative inline-block group">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#050315] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-black text-lg text-[#050315] mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'Shipping & Returns', path: '/shipping' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'FAQs', path: '/faqs' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm font-medium text-[#050315]/60 hover:text-[#050315] transition-colors relative inline-block group">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#050315] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-black text-lg text-[#050315] mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="text-sm font-medium text-[#050315]/60 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#dedcff]/40 flex items-center justify-center shrink-0 text-[#050315]">
                    <FaLocationDot size={14} />
                </div>
                <span className="pt-1">No. 128/5, Nugegoda<br/> Sri Lanka</span>
              </li>
              <li className="text-sm font-medium text-[#050315]/60 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#dedcff]/40 flex items-center justify-center shrink-0 text-[#050315]">
                    <FaPhone size={14} />
                </div>
                <a href="tel:+8801234567897" className="hover:text-[#050315] transition-colors pt-1">+94 773401556</a>
              </li>
              <li className="text-sm font-medium text-[#050315]/60 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#dedcff]/40 flex items-center justify-center shrink-0 text-[#050315]">
                    <FaEnvelope size={14} />
                </div>
                <a href="mailto:info@designlab.com" className="hover:text-[#050315] transition-colors pt-1">info@designlab.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section (Copyright & Legal) */}
        <div className="pt-8 border-t border-[#dedcff] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-[#050315]/50 text-center md:text-left">
            © {new Date().getFullYear()} DesignLab. Visualizer. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs font-bold text-[#050315]/50 hover:text-[#050315] uppercase tracking-wider transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs font-bold text-[#050315]/50 hover:text-[#050315] uppercase tracking-wider transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}