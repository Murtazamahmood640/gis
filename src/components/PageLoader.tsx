import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated rings */}
            <div className="relative w-16 h-16">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-1 rounded-full border-2 border-primary/50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: "transparent" }}
              />
              <motion.div
                className="absolute inset-[22px] rounded-full bg-primary"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
