import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fbfbfe] pt-12 pb-8 border-t border-[#dedcff] font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        {/* Main Grid - Gaps reduced for a more compact look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-black tracking-tighter text-[#050315]">
                Design<span className="text-[#2f27ce]">Lab.</span>
              </span>
            </Link>
            <p className="text-xs font-bold text-[#050315]/50 leading-relaxed max-w-sm mb-6 uppercase tracking-tight">
              Transforming spaces with premium furniture and cutting-edge 3D technology.
            </p>
            <div className="flex items-center gap-2.5">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-[#dedcff] flex items-center justify-center text-[#2f27ce] hover:bg-[#2f27ce] hover:text-white transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections - Reduced margin bottoms */}
          <div>
            <h4 className="font-black text-[10px] text-[#050315] mb-4 uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Our Story', 'Careers'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs font-bold text-[#050315]/60 hover:text-[#2f27ce] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] text-[#050315] mb-4 uppercase tracking-[0.2em]">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Shipping', 'Track Order'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs font-bold text-[#050315]/60 hover:text-[#2f27ce] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-black text-[10px] text-[#050315] mb-4 uppercase tracking-[0.2em]">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-[#050315]/60">
                <FaLocationDot className="text-[#2f27ce] mt-0.5" size={12} />
                <span className="text-xs font-bold leading-tight">No. 128/5, Nugegoda, SL</span>
              </li>
              <li className="flex gap-3 text-[#050315]/60 font-bold text-xs items-center">
                <FaPhone className="text-[#2f27ce]" size={12} /> +94 77 340 1556
              </li>
              <li className="flex gap-3 text-[#050315]/60 font-bold text-xs items-center">
                <FaEnvelope className="text-[#2f27ce]" size={12} /> info@designlab.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Reduced padding top */}
        <div className="pt-6 border-t border-[#dedcff] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-[#050315]/30 uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} DesignLab. Visualizer.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-[9px] font-black text-[#050315]/40 hover:text-[#2f27ce] uppercase tracking-widest">Privacy</Link>
            <Link to="#" className="text-[9px] font-black text-[#050315]/40 hover:text-[#2f27ce] uppercase tracking-widest">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}