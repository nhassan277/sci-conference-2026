import { Mail, MapPin, Facebook } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200 pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SCI 2026</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Science at the Core of Innovation - Building Effective Partnerships between Universities and Industry
            </p>
            <p className="text-sm text-slate-400 leading-relaxed" dir="rtl">
              العلوم في قلب الإبتكار - بناء شراكات فاعلة بين الجامعات والصناعة
            </p>
            <div className="flex items-center gap-3 mt-6">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-12 object-contain" />
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-12 object-contain rounded-full" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About Conference
                </a>
              </li>
              <li>
                <a href="/speakers" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Keynote Speakers
                </a>
              </li>
              <li>
                <a href="/schedule" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Schedule
                </a>
              </li>
              <li>
                <a href="/awards" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Awards
                </a>
              </li>
              <li>
                <a href="/#registration" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Registration
                </a>
              </li>
              <li>
                <a href="/sponsors" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Sponsors
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Faculty of Science</p>
                  <p className="text-sm text-slate-400">Cairo University, Giza, Egypt</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:science.faculty.conference2026@gmail.com" className="text-sm text-slate-400 hover:text-white transition-colors">
                  science.faculty.conference2026@gmail.com
                </a>
              </li>

            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <p className="text-sm text-slate-400 mb-4">
              Stay updated with conference news and announcements
            </p>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/share/19H9L2Nnd2/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400">
                © {currentYear} Cairo University - Faculty of Science. All rights reserved.
              </p>
              <p className="text-sm text-slate-400 mt-1" dir="rtl">
                © {currentYear} جامعة القاهرة - كلية العلوم. جميع الحقوق محفوظة.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
