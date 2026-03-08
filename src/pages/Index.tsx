import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award, Star, ChevronRight, CheckCircle, Sparkles, Droplets, Gem, Wrench, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import heroVideo from "@/assets/hero-video.mp4";
import heroImage from "@/assets/hero-car.jpg";
import interiorImg from "@/assets/detail-interior.jpg";
import exteriorImg from "@/assets/detail-exterior.jpg";
import waxImg from "@/assets/detail-wax.jpg";

const services = [
  { title: "Interior Detailing", desc: "Deep clean every surface, leather conditioning, and odor removal for a fresh cabin feel. We treat seats, carpets, dashboards, and every hidden crevice.", image: interiorImg, price: "From $199.99" },
  { title: "Exterior Detailing", desc: "Hand wash, clay bar treatment, polish, and protective sealant for a showroom finish. Includes tire dressing and trim restoration.", image: exteriorImg, price: "From $179.99" },
  { title: "Super Wax Detail", desc: "Complete interior + exterior with premium ceramic wax finish for ultimate protection and a mirror-like shine that lasts for months.", image: waxImg, price: "From $229.99" },
];

const features = [
  { icon: Shield, title: "Premium Products", desc: "We use only the highest quality, eco-friendly detailing products trusted by professionals worldwide. Every product is carefully selected for optimal results." },
  { icon: Clock, title: "Convenient Booking", desc: "Easy online booking with flexible scheduling that fits your lifestyle. Same-day slots available with instant confirmation." },
  { icon: Award, title: "Expert Technicians", desc: "Certified detailers with years of experience in luxury and exotic vehicle care. Ongoing training ensures top-tier service." },
];

const stats = [
  { value: "2,500+", label: "Cars Detailed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "5+", label: "Years Experience" },
  { value: "4.9", label: "Average Rating" },
];

const guarantees = [
  "100% Satisfaction Guarantee",
  "Eco-Friendly Products",
  "Fully Insured & Bonded",
  "Same-Day Availability",
];

const howItWorks = [
  { step: "01", title: "Choose Your Service", desc: "Browse our packages and select the detailing service that suits your vehicle's needs." },
  { step: "02", title: "Book a Time Slot", desc: "Pick a convenient date and time. We offer flexible scheduling including weekends." },
  { step: "03", title: "We Detail Your Car", desc: "Our expert team handles every inch of your vehicle with precision and care." },
  { step: "04", title: "Enjoy the Results", desc: "Drive away in a vehicle that looks and feels brand new, inside and out." },
];

const additionalBenefits = [
  { icon: Droplets, title: "Water-Saving Tech", desc: "Our methods use up to 80% less water than traditional car washes while delivering superior results." },
  { icon: Gem, title: "Ceramic Protection", desc: "Long-lasting ceramic coatings that protect your paint from UV rays, bird droppings, and road contaminants." },
  { icon: Wrench, title: "Paint Correction", desc: "Advanced machine polishing removes swirl marks, scratches, and oxidation to restore factory finish." },
  { icon: ThumbsUp, title: "Mobile Service", desc: "Can't come to us? We come to you. Our fully equipped mobile units serve your home or office." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero with Video */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline poster={heroImage} className="w-full h-full object-cover">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <motion.span initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.3em" }} transition={{ duration: 1, delay: 0.3 }} className="text-primary font-medium text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 block">
              Premium Car Detailing
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Your Car Deserves{" "}<span className="text-gradient-sky">Perfection</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Experience the finest auto detailing service. We treat every vehicle with the care and precision it deserves — inside and out.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-sky text-primary-foreground font-semibold text-base sm:text-lg px-8 btn-glow hover:scale-105 transform duration-200">
                  Book Appointment <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/30 text-foreground hover:bg-primary/10 text-base sm:text-lg px-8 hover:scale-105 transform duration-200">
                  View Services
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
              {guarantees.map((g) => (
                <span key={g} className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" /> {g}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gradient-sky">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Our Services" title="Premium Detailing Packages" description="Choose from our carefully crafted detailing packages designed to restore and protect your vehicle." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-gradient-card border border-border rounded-xl overflow-hidden card-hover shine-hover hover:shadow-sky"
              >
                <div className="h-44 sm:h-52 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-primary text-sm font-semibold mb-1">{service.price}</div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.desc}</p>
                  <Link to="/services" className="inline-flex items-center text-primary text-sm font-medium hover:gap-2 transition-all gap-1 group/link text-hover-glow">
                    View Details <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Simple Process" title="How It Works" description="Getting your car detailed has never been easier." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 lg:mt-16">
            {howItWorks.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, type: "spring" }} className="relative p-6 text-center card-hover shine-hover rounded-xl">
                <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 150 }} className="text-6xl font-display font-bold text-primary/10 block mb-2">
                  {item.step}
                </motion.span>
                <h4 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Why Choose Us" title="The Premium Difference" description="We go above and beyond to deliver an exceptional detailing experience every time." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
            {features.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ scale: 1.03 }} className="text-center p-6 sm:p-8 rounded-xl card-hover shine-hover border border-border">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <feat.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="More Reasons" title="Beyond the Basics" description="We don't just clean cars — we restore, protect, and elevate your vehicle." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 lg:mt-16">
            {additionalBenefits.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="p-6 bg-secondary/30 border border-border rounded-xl card-hover shine-hover">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                </motion.div>
                <h4 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
            <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            <blockquote className="font-display text-xl sm:text-2xl md:text-3xl text-foreground leading-relaxed mb-6">
              "Absolutely incredible work. My car looks better than when I first bought it. The attention to detail is unmatched!"
            </blockquote>
            <p className="text-primary font-semibold">— James M., Verified Customer</p>
            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, type: "spring" }}>
                  <Star className="w-5 h-5 fill-primary text-primary" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your <span className="text-gradient-sky">Vehicle</span>?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Book your appointment today and experience the difference premium detailing makes.
            </p>
            <Link to="/book">
              <Button size="lg" className="bg-gradient-sky text-primary-foreground font-semibold text-base sm:text-lg px-10 btn-glow hover:scale-105 duration-200">
                Book Your Detail <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
