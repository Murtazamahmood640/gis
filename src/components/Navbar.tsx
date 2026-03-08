import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book Now" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-28 px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Global Integrated Support" className="h-24 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+15551234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            (555) 123-4567
          </a>
          <Link to="/book">
            <Button className="bg-gradient-sky text-primary-foreground font-semibold px-6 hover:opacity-90 transition-opacity">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden glass-dark border-b border-border"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/book" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  Book Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
