import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setDialogType('error');
      setDialogMessage("Please enter email and password");
      setShowDialog(true);
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success === true) {
        setDialogType('success');
        setDialogMessage("Welcome back, Admin!");
        setShowDialog(true);
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      } else {
        setDialogType('error');
        setDialogMessage("Invalid credentials");
        setShowDialog(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setDialogType('error');
      setDialogMessage("Something went wrong. Please try again.");
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-card border border-border rounded-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-gold mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to manage your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@premiumdetail.com"
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>

          <div>
            <Label className="text-foreground">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Sign In"}
          </Button>
        </form>
      </motion.div>

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
    </div>
  );
}
