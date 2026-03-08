import { motion } from "framer-motion";

interface Props {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeading({ subtitle, title, description, align = "center" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {subtitle && (
        <span className="text-primary font-medium text-sm uppercase tracking-[0.2em] mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
