import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Mail, X } from "lucide-react";

const contacts = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/15551234567",
    bg: "bg-emerald-500",
  },
  {
    icon: Phone,
    label: "Call",
    href: "tel:+15551234567",
    bg: "bg-primary",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:support@globalintegratedsupport.com",
    bg: "bg-accent",
  },
];

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.label === "WhatsApp" ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              className={`${c.bg} text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
              title={c.label}
            >
              <c.icon className="w-5 h-5" />
            </motion.a>
          ))}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-sky text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-sky hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
