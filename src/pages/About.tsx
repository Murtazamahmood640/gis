import { motion } from "framer-motion";
import { Shield, Users, Award, Heart, CheckCircle, Sparkles, Clock, Leaf, Target, Zap, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import heroAbout from "@/assets/hero-about.jpg";

const values = [
  { icon: Shield, title: "Quality First", desc: "We never cut corners. Every detail matters, from the products we use to the techniques we employ. Excellence is our standard." },
  { icon: Users, title: "Customer Focus", desc: "Your satisfaction is our priority. We tailor every service to meet your specific needs and expectations, every single time." },
  { icon: Award, title: "Excellence", desc: "Our team is certified and continuously trained in the latest detailing techniques, tools, and technologies." },
  { icon: Heart, title: "Passion", desc: "We genuinely love what we do. That passion shows in every vehicle we touch and every customer interaction we have." },
];

const process = [
  { step: "01", title: "Book Online", desc: "Select your vehicle brand, choose a service, and pick a convenient time slot through our easy booking system. Instant confirmation." },
  { step: "02", title: "Vehicle Assessment", desc: "Our technicians perform a thorough inspection of your vehicle to identify areas needing special attention and create a custom plan." },
  { step: "03", title: "Expert Detailing", desc: "Using premium products and advanced techniques, we meticulously detail every surface of your vehicle to perfection." },
  { step: "04", title: "Quality Check", desc: "A final walkthrough ensures every detail meets our exacting standards before your vehicle is returned to you." },
];

const whyUs = [
  { icon: Sparkles, title: "Premium Products", desc: "We exclusively use professional-grade, pH-balanced products safe for all vehicle finishes and interiors." },
  { icon: Clock, title: "On-Time Service", desc: "We respect your schedule. Appointments start and finish on time, every time. No surprises, no delays." },
  { icon: Leaf, title: "Eco-Friendly", desc: "Our waterless and low-water techniques conserve up to 100 gallons per wash compared to traditional methods." },
  { icon: CheckCircle, title: "Satisfaction Guarantee", desc: "Not happy with the results? We'll re-do the service at no extra charge. Your satisfaction is non-negotiable." },
];

const milestones = [
  { year: "2019", title: "Founded", desc: "Started as a one-person mobile detailing service with a passion for perfection." },
  { year: "2020", title: "First Studio", desc: "Opened our first dedicated detailing studio with professional-grade equipment." },
  { year: "2022", title: "1,000 Cars", desc: "Reached our 1,000th vehicle milestone with a 98% customer satisfaction rate." },
  { year: "2024", title: "Team Expansion", desc: "Grew to a team of certified professionals and expanded our service offerings." },
  { year: "2025", title: "2,500+ Cars", desc: "Surpassed 2,500 vehicles detailed with continued growth and 5-star reviews." },
];

const teamTraits = [
  { icon: Target, title: "Detail-Oriented", desc: "Every team member is trained to spot imperfections invisible to the untrained eye." },
  { icon: Zap, title: "Efficient", desc: "We deliver exceptional results within promised timelines without compromising quality." },
  { icon: Star, title: "Experienced", desc: "Each technician brings years of hands-on experience with all vehicle types and conditions." },
  { icon: Users, title: "Trustworthy", desc: "Fully insured, background-checked, and committed to treating your vehicle with respect." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero backgroundImage={heroAbout} subtitle="About Us" title="Driven by Perfection" description="We're a team of passionate detailing professionals dedicated to making every vehicle look its absolute best." />

      {/* Story */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Story</h3>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">Founded with a simple mission — to provide the highest quality auto detailing service with unmatched attention to detail. Over the years, we've detailed thousands of vehicles, from daily drivers to exotic supercars.</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">What started as a one-man operation has grown into a full-service detailing studio backed by a team of certified professionals. We invest in ongoing training, cutting-edge equipment, and premium products.</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">We believe that every car owner deserves access to professional-grade detailing. That's why we offer flexible packages, competitive pricing, and a commitment to excellence regardless of your vehicle's make or model.</p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="text-center p-6 bg-gradient-card border border-border rounded-xl card-hover shine-hover">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 lg:py-20 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Our Journey" title="Key Milestones" description="A look at our growth over the years." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring" }} whileHover={{ scale: 1.05 }} className="text-center p-5 border border-border rounded-xl card-hover shine-hover">
                <span className="text-2xl font-display font-bold text-primary">{m.year}</span>
                <h4 className="font-display text-base font-bold text-foreground mt-2 mb-1">{m.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="How It Works" title="Our Process" description="From booking to delivery, here's what you can expect." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {process.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, type: "spring" }} className="relative p-6 card-hover shine-hover rounded-xl border border-transparent">
                <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.2, type: "spring" }} className="text-5xl font-display font-bold text-primary/15 absolute top-2 left-4">{p.step}</motion.span>
                <div className="relative pt-8">
                  <h4 className="font-display text-lg font-bold text-foreground mb-2">{p.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Traits */}
      <section className="py-12 lg:py-20 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Our Team" title="Meet the Experts" description="Our technicians are the backbone of our service." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {teamTraits.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="p-6 border border-border rounded-xl card-hover shine-hover">
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

      {/* Why Choose Us */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Why Us" title="The Difference" description="Here's what sets us apart from the rest." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="p-6 bg-gradient-card border border-border rounded-xl card-hover shine-hover">
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

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Experience the <span className="text-gradient-sky">Difference</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of satisfied customers who trust us with their vehicles.</p>
            <Link to="/book">
              <Button size="lg" className="bg-gradient-sky text-primary-foreground font-semibold px-10 btn-glow hover:scale-105 duration-200">
                Book Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
