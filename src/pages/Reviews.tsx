import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, ThumbsUp, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import heroReviews from "@/assets/hero-reviews.jpg";

const reviews = [
  { name: "James M.", rating: 5, text: "Absolutely incredible work. My car looks better than when I first bought it. The attention to detail is unmatched! Every surface was spotless and the ceramic coating gives an amazing depth to the paint.", avatar: "JM" },
  { name: "Sarah K.", rating: 5, text: "The Super Wax Detail was worth every penny. My Tesla has never looked this good. The ceramic coating gives an amazing shine that has lasted months. Will definitely be coming back for regular service!", avatar: "SK" },
  { name: "Michael R.", rating: 5, text: "Professional service from start to finish. They were on time, thorough, and my SUV looks brand new. The interior smells incredible and every crevice was cleaned. Highly recommend to everyone!", avatar: "MR" },
  { name: "Emily D.", rating: 5, text: "I've tried many detailing services and this is by far the best. The ceramic coating they applied is still holding up months later. Their expertise with paint correction is truly impressive. Worth the investment.", avatar: "ED" },
  { name: "David L.", rating: 4, text: "Great service and very convenient booking system. The interior detail was thorough and my car smells amazing. The team was friendly and professional. Only wish they had weekend evening slots.", avatar: "DL" },
  { name: "Amanda T.", rating: 5, text: "They treated my car like it was their own. Every inch was cleaned and polished perfectly. The best detailing experience I've had in 10 years of owning cars. The before and after difference was stunning.", avatar: "AT" },
  { name: "Robert C.", rating: 5, text: "Brought my classic Mustang in for a full detail before a car show. They understood exactly what was needed for a vintage vehicle and delivered beyond expectations. Won first place thanks to their work!", avatar: "RC" },
  { name: "Linda P.", rating: 5, text: "As a busy mom, I never have time to clean my minivan properly. These guys made it look brand new inside and out. Even got the crayon marks out of the seats! The kids couldn't believe it was the same car.", avatar: "LP" },
  { name: "Chris W.", rating: 4, text: "Solid exterior detail on my truck. The paint correction removed years of swirl marks and the sealant has kept it looking fresh. Very happy with the results and fair pricing for the quality delivered.", avatar: "CW" },
  { name: "Patricia H.", rating: 5, text: "Outstanding mobile service! They came to my office and had my BMW looking showroom-fresh by the time I finished work. The convenience factor alone makes this my go-to detailing service. Incredible quality.", avatar: "PH" },
  { name: "Kevin B.", rating: 5, text: "Had my boat and truck detailed before summer. Both looked absolutely perfect. The marine detailing work was exceptional — removed all the water stains and oxidation. Highly recommend for boats too!", avatar: "KB" },
  { name: "Jennifer S.", rating: 5, text: "First time customer and I'm already a loyal one. The online booking was seamless, the pricing transparent, and the results spectacular. My Audi Q5 has never looked better. Five stars all the way!", avatar: "JS" },
];

const statsData = [
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: ThumbsUp, value: "98%", label: "Would Recommend" },
  { icon: MessageSquare, value: "300+", label: "5-Star Reviews" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < count ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        backgroundImage={heroReviews}
        subtitle="Testimonials"
        title="What Our Clients Say"
        description="Don't just take our word for it — hear from our satisfied customers."
      >
        <div className="flex justify-center gap-6 sm:gap-10 mt-10">
          {statsData.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1, type: "spring" }} className="text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-2xl sm:text-3xl font-display font-bold text-gradient-sky">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </PageHero>

      {/* Featured Review */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center bg-gradient-card border border-primary/30 rounded-2xl p-8 sm:p-12 card-hover shine-hover">
            <Quote className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <p className="text-foreground text-lg sm:text-xl leading-relaxed mb-6 font-display">"Absolutely incredible work. My car looks better than when I first bought it. The attention to detail is unmatched!"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-sky flex items-center justify-center text-primary-foreground font-bold">JM</div>
              <div className="text-left">
                <div className="text-foreground font-semibold">James M.</div>
                <Stars count={5} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-card border border-border rounded-xl p-5 sm:p-6 card-hover shine-hover"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-foreground text-sm leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-sky flex items-center justify-center text-primary-foreground font-bold text-sm">{review.avatar}</div>
                  <div>
                    <div className="text-foreground font-semibold text-sm">{review.name}</div>
                    <Stars count={review.rating} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Join Our <span className="text-gradient-sky">Happy Customers</span></h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Experience the quality that keeps our clients coming back.</p>
            <Link to="/book">
              <Button size="lg" className="bg-gradient-sky text-primary-foreground font-semibold px-10 btn-glow hover:scale-105 duration-200">
                Book Your Detail <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
