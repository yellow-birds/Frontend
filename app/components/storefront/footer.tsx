import { Link } from "react-router";
import { Bird, Phone, Mail, MapPin } from "lucide-react";

const SHOP_LINKS = [
  { label: "All Products", to: "/merchandise" },
  { label: "Best Sellers", to: "/merchandise?sort=best_seller" },
  { label: "New Arrivals", to: "/merchandise?sort=newest" },
  { label: "T-shirts & Polos", to: "/merchandise?category=T-shirts+%26+Polos" },
  { label: "Hoodies & Jackets", to: "/merchandise?category=Hoodies+%26+Jackets" },
  { label: "Bottles & Mugs", to: "/merchandise?category=Bottles+%26+Mugs" },
  { label: "Bags & Backpacks", to: "/merchandise?category=Bags+%26+Backpacks" },
  { label: "Caps & Hats", to: "/merchandise?category=Caps+%26+Hats" },
  { label: "Eco-friendly", to: "/merchandise?category=Eco-friendly" },
  { label: "Corporate Gifting", to: "/merchandise?category=Corporate+Gifting" },
];

const SUPPORT_LINKS = [
  { label: "Track Your Order", to: "/order-tracking" },
  { label: "My Orders", to: "/orders" },
  { label: "FAQ", href: "#" },
  { label: "Contact Us", href: "mailto:hello@yellowbirds.com" },
  { label: "Bulk Orders", href: "#" },
  { label: "Custom Design Help", href: "#" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main footer grid */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="h-10 w-10 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0">
                <Bird className="h-5 w-5 text-black" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">yellowbirds</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Custom T-shirts, merchandise & gifts for teams, events, and brands worldwide. High quality. No minimums. Fast global shipping.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm text-gray-400">
              <a href="tel:+97158224" className="flex items-center gap-2.5 hover:text-yellow-400 transition-colors group">
                <div className="h-8 w-8 rounded-lg bg-gray-800 group-hover:bg-yellow-400 flex items-center justify-center transition-colors shrink-0">
                  <Phone className="h-3.5 w-3.5 text-gray-400 group-hover:text-black" />
                </div>
                800-MERCH (24/7 Support)
              </a>
              <a href="mailto:hello@yellowbirds.com" className="flex items-center gap-2.5 hover:text-yellow-400 transition-colors group">
                <div className="h-8 w-8 rounded-lg bg-gray-800 group-hover:bg-yellow-400 flex items-center justify-center transition-colors shrink-0">
                  <Mail className="h-3.5 w-3.5 text-gray-400 group-hover:text-black" />
                </div>
                hello@yellowbirds.com
              </a>
              <span className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <span className="leading-relaxed">
                  yellowbirds HQ<br />
                  123 Merch Street, Dubai, UAE
                </span>
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-extrabold text-sm mb-5 text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-extrabold text-sm mb-5 text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  {"to" in l ? (
                    <Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-extrabold text-sm mb-5 text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-8 space-y-2">
              {["50,000+ Happy Customers", "120+ Countries Delivered", "No Minimums Policy", "Free Global Shipping"].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                  <span className="text-xs text-gray-500">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} yellowbirds. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
          <span className="flex items-center gap-1">
            Made with <span className="text-yellow-400">♥</span> for teams everywhere
          </span>
        </div>
      </div>
    </footer>
  );
}
