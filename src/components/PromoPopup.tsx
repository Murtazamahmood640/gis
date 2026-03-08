import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const VALID_PROMO = "FIRST10";

export default function PromoPopup() {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const seen = sessionStorage.getItem("promo_seen");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleApply = () => {
    if (code.trim().toUpperCase() === VALID_PROMO) {
      localStorage.setItem("promo_code", VALID_PROMO);
      toast.success("Promo code applied! 10% discount will be applied at checkout.");
      handleClose();
    } else {
      toast.error("Invalid promo code. Try FIRST10!");
    }
  };

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("promo_seen", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-gradient-card border border-gold rounded-2xl p-8 max-w-md w-full shadow-gold-lg"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-gold mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                Get <span className="text-gradient-gold">10% OFF</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Your first detail! Enter promo code below.
              </p>

              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                />
                <Button
                  onClick={handleApply}
                  className="bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity px-6"
                >
                  Apply
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Use code <span className="text-primary font-semibold">FIRST10</span> for 10% off
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
