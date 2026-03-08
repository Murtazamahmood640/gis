import { motion } from "framer-motion";

interface Props {
  subtitle?: string;
  title: string;
  description?: string;
  backgroundImage: string;
  children?: React.ReactNode;
}

export default function PageHero({ subtitle, title, description, backgroundImage, children }: Props) {
  return (
    <section className="page-hero">
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        <div className="page-hero-overlay" />
      </div>
      <div className="relative container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {subtitle && (
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-primary font-medium text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 block"
            >
              {subtitle}
            </motion.span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {title}
          </h1>
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
            >
              {description}
            </motion.p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
