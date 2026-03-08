import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Car, Trash2, ShoppingCart, CheckCircle, AlertCircle, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import { TIME_SLOTS } from "@/data/pricing";
import { useCart } from "@/contexts/CartContext";
import heroBook from "@/assets/hero-book.jpg";

interface ActiveCoupon {
  code: string;
  discountPercentage: number;
  expiryDate: string;
}

export default function BookPage() {
  const { items, removeItem, clearCart, total: cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<ActiveCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(true);

  const [form, setForm] = useState({
     fullName: "",
     phone: "",
     email: "",
     address: "",
     vehicleName: "",
     make: "",
     model: "",
     year: "",
     promoCode: "",
     timeSlot: "",
     vehicleCategory: "",
   });
   const [date, setDate] = useState<Date>();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  // Fetch active coupon on component mount
  useEffect(() => {
    const fetchActiveCoupon = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/coupons/active`);
        const data = await response.json();
        if (data.success && data.coupon) {
          setActiveCoupon(data.coupon);
        }
      } catch (error) {
        console.error("Error fetching active coupon:", error);
      } finally {
        setCouponLoading(false);
      }
    };
    fetchActiveCoupon();
  }, []);

  // Calculate discount based on active coupon or user-entered promo
  const savedPromo = localStorage.getItem("promo_code");
  const userPromoCode = form.promoCode.trim().toUpperCase() || savedPromo || "";
  
  // Use active coupon if available and no custom promo code entered
  let discountPercentage = 0;
  let appliedCouponCode = "";
  
  if (userPromoCode) {
    // User entered a promo code manually
    appliedCouponCode = userPromoCode;
    if (userPromoCode === "FIRST10") {
      discountPercentage = 10;
    }
  } else if (activeCoupon) {
    // Use the active coupon from the system
    appliedCouponCode = activeCoupon.code;
    discountPercentage = activeCoupon.discountPercentage;
  }

  const discount = (cartTotal * discountPercentage) / 100;
  const finalTotal = Math.max(0, cartTotal - discount);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !date || !form.timeSlot) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty. Add services from the Services page.");
      return;
    }

    setIsLoading(true);
    try {
      const serviceType = items.map(item => item.serviceType).join(", ");
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          vehicleName: form.vehicleName,
          make: form.make,
          model: form.model,
          year: form.year,
          serviceType: serviceType,
          vehicleCategory: items[0]?.vehicleCategory || "Car",
          date: date?.toISOString().split('T')[0],
          timeSlot: form.timeSlot,
          promoCode: appliedCouponCode,
          discountApplied: discountPercentage > 0,
          totalPrice: finalTotal,
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setDialogType('error');
        setDialogMessage(data.message || "Failed to create appointment");
        setShowDialog(true);
        return;
      }

      setDialogType('success');
      setDialogMessage("Appointment request submitted! We'll confirm your booking shortly.");
      setShowDialog(true);
      clearCart();
      setForm({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        vehicleName: "",
        make: "",
        model: "",
        year: "",
        promoCode: "",
        timeSlot: "",
        vehicleCategory: "",
      });
      setDate(undefined);
    } catch (error) {
      console.error("Booking error:", error);
      setDialogType('error');
      setDialogMessage("Network error. Please try again.");
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero backgroundImage={heroBook} subtitle="Book Now" title="Schedule Your Detail" description="Review your selected services and fill out the form below." />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-8">
            {/* Cart Items */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-card border border-primary/30 rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" /> Your Cart ({items.length})
              </h3>
              {items.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">No services selected. <a href="/services" className="text-primary hover:underline text-hover-glow">Browse services</a></p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between bg-secondary/50 rounded-lg p-4 border border-border shine-hover">
                      <div>
                        <div className="text-foreground font-semibold">{item.serviceType}</div>
                        <div className="text-xs text-muted-foreground">{item.brand} · {item.vehicleCategory}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                        <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label className="text-foreground">Full Name *</Label><Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Cell Number *</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Email *</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Address</Label><Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main St" className="bg-secondary border-border text-foreground mt-1" /></div>
              </div>
            </motion.div>

            {/* Vehicle Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Car className="w-5 h-5 text-primary" /> Vehicle Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label className="text-foreground">Vehicle Name</Label><Input value={form.vehicleName} onChange={(e) => update("vehicleName", e.target.value)} placeholder="e.g. Tesla Model 3" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Make</Label><Input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. Tesla" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Model</Label><Input value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="e.g. Model 3" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Year</Label><Input value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="e.g. 2024" className="bg-secondary border-border text-foreground mt-1" /></div>
              </div>
            </motion.div>

            {/* Scheduling */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground">Scheduling</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-secondary border-border mt-1", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-foreground">Time Slot *</Label>
                  <Select value={form.timeSlot} onValueChange={(v) => update("timeSlot", v)}>
                    <SelectTrigger className="bg-secondary border-border text-foreground mt-1"><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent className="bg-card border-border">{TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Promo & Pricing */}
            {items.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-card border border-primary/30 rounded-xl p-6 lg:p-8 space-y-4 card-hover">
                <h3 className="font-display text-xl font-bold text-foreground">Promo & Total</h3>
                
                {/* Active Coupon Banner */}
                {!couponLoading && activeCoupon && !userPromoCode && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-emerald-400">Active Discount Code</div>
                        <div className="text-foreground font-mono font-bold text-lg mt-1">{activeCoupon.code}</div>
                        <div className="text-xs text-muted-foreground mt-1">Automatic discount of {activeCoupon.discountPercentage}% applied at checkout</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">{activeCoupon.discountPercentage}%</div>
                        <div className="text-xs text-muted-foreground">OFF</div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div><Label className="text-foreground">Promo Code</Label><Input value={form.promoCode || savedPromo || ""} onChange={(e) => update("promoCode", e.target.value)} placeholder={activeCoupon ? `${activeCoupon.code} is active` : "Enter promo code"} className="bg-secondary border-border text-foreground mt-1" /></div>
                <div className="border-t border-border pt-4 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm"><span className="text-muted-foreground">{item.serviceType} ({item.vehicleCategory})</span><span className="text-foreground">${item.price.toFixed(2)}</span></div>
                  ))}
                  <div className="flex justify-between text-sm border-t border-border pt-2"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${cartTotal.toFixed(2)}</span></div>
                  {discountPercentage > 0 && <div className="flex justify-between text-sm"><span className="text-primary">Discount ({discountPercentage}%)</span><span className="text-primary">-${discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-2"><span className="text-foreground">Total</span><span className="text-gradient-sky">${finalTotal.toFixed(2)}</span></div>
                </div>
              </motion.div>
            )}

            <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-gradient-sky text-primary-foreground font-semibold text-lg btn-glow hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Success/Error Dialog */}
      {showDialog && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-xl p-8 max-w-sm w-full shadow-xl">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${dialogType === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {dialogType === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {dialogType === 'success' ? 'Success' : 'Error'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">{dialogMessage}</p>
                <Button onClick={() => setShowDialog(false)} className={`w-full ${dialogType === 'success' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                  Close
                </Button>
              </div>
              <button onClick={() => setShowDialog(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
