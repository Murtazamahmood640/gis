import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Two subtle floating gradient orbs - lightweight */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.035]"
        style={{
          background: "radial-gradient(circle, hsl(187 71% 65%) 0%, transparent 70%)",
          top: "5%",
          left: "-10%",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.025]"
        style={{
          background: "radial-gradient(circle, hsl(187 60% 50%) 0%, transparent 70%)",
          bottom: "10%",
          right: "-10%",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Minimal floating dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/15"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i * 11) % 60}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}
