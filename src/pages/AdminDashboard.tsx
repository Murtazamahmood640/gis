import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut, Search, Filter, Pencil, Trash2, Eye, Download, Plus,
  CalendarDays, Clock, DollarSign, Users, CheckCircle, AlertCircle, Tag, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Appointment, MOCK_APPOINTMENTS } from "@/data/mockAppointments";

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Reviewed' | 'Responded' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  avatar: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-primary/20 text-primary border-primary/30",
  Confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Cancelled: "bg-destructive/20 text-red-400 border-destructive/30",
};

export default function AdminDashboard() {
  const { logout, token } = useAdminAuth();
  const navigate = useNavigate();
  
  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editApt, setEditApt] = useState<Appointment | null>(null);
  const [viewApt, setViewApt] = useState<Appointment | null>(null);
  const [editStatus, setEditStatus] = useState("");

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ email: "", password: "", fullName: "", role: "user" });
  const [editUserData, setEditUserData] = useState({ fullName: "", role: "user", isActive: true });

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponSearch, setCouponSearch] = useState("");
  const [couponStatusFilter, setCouponStatusFilter] = useState("all");
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState({ code: "", discountPercentage: "", expiryDate: "" });
  const [editCouponData, setEditCouponData] = useState({ discountPercentage: "", expiryDate: "" });

  // Promos state (for backward compatibility with existing code)
  const [promos, setPromos] = useState<any[]>([]);
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", discountPercentage: "", expiryDate: "" });

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "admin@example.com",
    rating: 5,
    text: "",
    avatar: "★",
    isApproved: true,
  });
  const [creatingReview, setCreatingReview] = useState(false);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'appointment' | 'user' | 'coupon' | 'contact' | 'review' | null; id: string }>({ type: null, id: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Load users and coupons on mount
  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCoupons();
      fetchAppointments();
      fetchContacts();
      fetchReviews();
    }
  }, [token]);

  // API calls
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userRoleFilter !== 'all') params.append('role', userRoleFilter);
      if (userStatusFilter !== 'all') params.append('status', userStatusFilter);

      const response = await fetch(`http://localhost:3000/api/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error("[v0] Error fetching users:", error);
      toast.error('Error loading users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/appointments");
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch appointments`);
      }

      const data = await response.json();

      if (data.success) {
        const appointmentData = Array.isArray(data.data) ? data.data : data.appointments || [];
        setAppointments(appointmentData);
        console.log("[v0] Loaded appointments:", appointmentData.length);
      } else {
        console.error("[v0] Failed to load appointments:", data.message);
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("[v0] Error fetching appointments:", error);
      toast.error("Error loading appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const params = new URLSearchParams();
      if (couponSearch) params.append('search', couponSearch);
      if (couponStatusFilter !== 'all') params.append('status', couponStatusFilter);

      const response = await fetch(`http://localhost:3000/api/coupons?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
      } else {
        toast.error(data.message || 'Failed to load coupons');
      }
    } catch (error) {
      console.error("[v0] Error fetching coupons:", error);
      toast.error('Error loading coupons');
    } finally {
      setCouponsLoading(false);
    }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      } else {
        toast.error(data.message || 'Failed to load contacts');
      }
    } catch (error) {
      console.error("[v0] Error fetching contacts:", error);
      toast.error('Error loading contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const params = new URLSearchParams();
      if (reviewSearch) params.append('search', reviewSearch);
      if (reviewStatusFilter !== 'all') params.append('status', reviewStatusFilter);

      const response = await fetch(`http://localhost:3000/api/reviews?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message || 'Failed to load reviews');
      }
    } catch (error) {
      console.error("[v0] Error fetching reviews:", error);
      toast.error('Error loading reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleToggleReviewApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reviews?id=${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Review approval status updated');
        fetchReviews();
      } else {
        toast.error(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error("[v0] Error toggling review approval:", error);
      toast.error('Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeleteConfirm({ type: 'review', id: reviewId });
  };

  const handleCreateReview = async () => {
    if (!newReview.name || !newReview.text) {
      toast.error('Fill all required fields');
      return;
    }

    setCreatingReview(true);
    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Review created successfully');
        setNewReview({ name: "", email: "admin@example.com", rating: 5, text: "", avatar: "★", isApproved: true });
        setShowAddReview(false);
        fetchReviews();
      } else {
        toast.error(data.message || 'Failed to create review');
      }
    } catch (error) {
      console.error("[v0] Error creating review:", error);
      toast.error('Error creating review');
    } finally {
      setCreatingReview(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast.error('Fill all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User created successfully');
        setNewUser({ email: "", password: "", fullName: "", role: "user" });
        setShowAddUser(false);
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error("[v0] Error creating user:", error);
      toast.error('Error creating user');
    }
  };

  const handleUpdateUser = async (userId: string) => {
    if (!editUserData.fullName) {
      toast.error('Full name is required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editUserData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error("[v0] Error updating user:", error);
      toast.error('Error updating user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleteConfirm({ type: 'user', id: userId });
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discountPercentage || !newCoupon.expiryDate) {
      toast.error('Fill all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCoupon.code,
          discountPercentage: Number(newCoupon.discountPercentage),
          expiryDate: newCoupon.expiryDate
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Coupon created successfully');
        setNewCoupon({ code: "", discountPercentage: "", expiryDate: "" });
        setShowAddCoupon(false);
        fetchCoupons();
      } else {
        toast.error(data.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error("[v0] Error creating coupon:", error);
      toast.error('Error creating coupon');
    }
  };

  const handleUpdateCoupon = async (couponId: string) => {
    if (!editCouponData.discountPercentage || !editCouponData.expiryDate) {
      toast.error('Fill all required fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/coupons?id=${couponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          discountPercentage: Number(editCouponData.discountPercentage),
          expiryDate: editCouponData.expiryDate
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Coupon updated successfully');
        setEditingCoupon(null);
        fetchCoupons();
      } else {
        toast.error(data.message || 'Failed to update coupon');
      }
    } catch (error) {
      console.error("[v0] Error updating coupon:", error);
      toast.error('Error updating coupon');
    }
  };

  const handleToggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/api/coupons?id=${couponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Coupon status updated');
        fetchCoupons();
      } else {
        toast.error(data.message || 'Failed to update coupon');
      }
    } catch (error) {
      console.error("[v0] Error toggling coupon:", error);
      toast.error('Error updating coupon');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    setDeleteConfirm({ type: 'coupon', id: couponId });
  };

  // Appointment handlers
  const handleUpdateAppointment = async (appointmentId: string) => {
    if (!editStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: editStatus })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update appointment`);
      }
      
      const data = await response.json();
      if (data.success) {
        toast.success('Appointment updated successfully');
        setEditApt(null);
        setEditStatus('');
        fetchAppointments();
      } else {
        toast.error(data.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error("[v0] Error updating appointment:", error);
      toast.error('Error updating appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setDeleteConfirm({ type: 'appointment', id: appointmentId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.type || !deleteConfirm.id) return;
    
    setIsDeleting(true);
    try {
      let endpoint = '';
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      
      if (deleteConfirm.type !== 'appointment') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      switch (deleteConfirm.type) {
        case 'appointment':
          endpoint = `http://localhost:3000/api/appointments/${deleteConfirm.id}`;
          break;
        case 'user':
          endpoint = `http://localhost:3000/api/users?id=${deleteConfirm.id}`;
          break;
        case 'coupon':
          endpoint = `http://localhost:3000/api/coupons?id=${deleteConfirm.id}`;
          break;
        case 'contact':
          endpoint = `http://localhost:3000/api/contact?id=${deleteConfirm.id}`;
          break;
        case 'review':
          endpoint = `http://localhost:3000/api/reviews?id=${deleteConfirm.id}`;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to delete`);
      }
      
      const data = await response.json();
      if (data.success) {
        toast.success(`${deleteConfirm.type.charAt(0).toUpperCase() + deleteConfirm.type.slice(1)} deleted successfully`);
        setDeleteConfirm({ type: null, id: '' });
        
        if (deleteConfirm.type === 'appointment') fetchAppointments();
        else if (deleteConfirm.type === 'user') fetchUsers();
        else if (deleteConfirm.type === 'coupon') fetchCoupons();
        else if (deleteConfirm.type === 'contact') fetchContacts();
        else if (deleteConfirm.type === 'review') fetchReviews();
      } else {
        toast.error(data.message || `Failed to delete ${deleteConfirm.type}`);
      }
    } catch (error) {
      console.error("[v0] Error deleting:", error);
      toast.error(`Error deleting ${deleteConfirm.type}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User status updated');
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error("[v0] Error toggling user status:", error);
      toast.error('Error updating user');
    }
  };

  const handleUpdateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/contact?id=${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Contact status updated');
        fetchContacts();
        setEditingContact(null);
      } else {
        toast.error(data.message || 'Failed to update contact');
      }
    } catch (error) {
      console.error("[v0] Error updating contact status:", error);
      toast.error('Error updating contact');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    setDeleteConfirm({ type: 'contact', id: contactId });
  };

  // Calculate price with coupon discount
  const calculatePrice = (originalPrice: number, discountPercentage: number = 0) => {
    if (discountPercentage <= 0) return originalPrice;
    const discount = (originalPrice * discountPercentage) / 100;
    return Math.round((originalPrice - discount) * 100) / 100;
  };

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  // Safely calculate filtered appointments
  const filtered = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) {
      return [];
    }
    return appointments.filter((a) => {
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const searchId = a._id || a.id || '';
      const matchSearch = !search || a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || searchId.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [appointments, statusFilter, search]);

  // Safely calculate stats
  const stats = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        revenue: 0,
      };
    }
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "Pending").length,
      confirmed: appointments.filter((a) => a.status === "Confirmed").length,
      revenue: appointments.filter((a) => a.status !== "Cancelled").reduce((sum, a) => sum + a.totalPrice, 0),
    };
  }, [appointments]);



  const handleExportCSV = () => {
    const headers = "ID,Name,Phone,Email,Service,Vehicle,Date,Time,Status,Total\n";
    const rows = filtered.map((a) => `${a.id},${a.fullName},${a.phone},${a.email},${a.serviceType},${a.vehicleCategory},${a.date},${a.timeSlot},${a.status},${a.totalPrice}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "appointments.csv"; link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const handleAddPromo = () => {
    if (!newPromo.code || !newPromo.discountPercentage || !newPromo.expiryDate) {
      toast.error("Fill all promo fields."); return;
    }
    const newPromoObj = {
      id: Date.now().toString(),
      code: newPromo.code.toUpperCase(),
      discountPercentage: Number(newPromo.discountPercentage),
      isActive: true,
      expiryDate: newPromo.expiryDate
    };
    setPromos((prev) => [...prev, newPromoObj]);
    setNewPromo({ code: "", discountPercentage: "", expiryDate: "" });
    setShowAddPromo(false);
    toast.success("Promo code added!");
  };

  const togglePromo = (id: string) => {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const deletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Promo code deleted.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-dark border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-gradient-sky font-display text-xl font-bold">PREMIUM</span>
            <span className="text-foreground font-display text-xl font-light">Admin</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Bookings", value: stats.total, color: "text-primary" },
            { icon: AlertCircle, label: "Pending", value: stats.pending, color: "text-primary" },
            { icon: CheckCircle, label: "Confirmed", value: stats.confirmed, color: "text-emerald-400" },
            { icon: DollarSign, label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "text-primary" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="appointments">
          <TabsList className="bg-secondary border border-border mb-6 flex flex-wrap">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Appointments</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-1" /> Users
            </TabsTrigger>
            <TabsTrigger value="coupons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Tag className="w-4 h-4 mr-1" /> Coupons
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Star className="w-4 h-4 mr-1" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <AlertCircle className="w-4 h-4 mr-1" /> Contacts
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or ID..." className="bg-secondary border-border text-foreground pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>

            <div className="bg-gradient-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["ID", "Customer", "Service", "Vehicle", "Date", "Status", "Total", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsLoading ? (
                      <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">Loading appointments...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No appointments found.</td></tr>
                    ) : filtered.map((apt) => (
                      <tr key={apt._id || apt.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-primary font-mono text-xs">{apt.id}</td>
                        <td className="px-4 py-3"><div className="text-foreground font-medium">{apt.fullName}</div><div className="text-xs text-muted-foreground">{apt.email}</div></td>
                        <td className="px-4 py-3 text-foreground">{apt.serviceType}</td>
                        <td className="px-4 py-3"><div className="text-foreground">{apt.vehicleName}</div><div className="text-xs text-muted-foreground">{apt.vehicleCategory}</div></td>
                        <td className="px-4 py-3">
                          <div className="text-foreground flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {apt.date}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.timeSlot}</div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="outline" className={`text-xs ${STATUS_COLORS[apt.status]}`}>{apt.status}</Badge></td>
                        <td className="px-4 py-3">
                          <span className="text-foreground font-semibold">${apt.totalPrice.toFixed(2)}</span>
                          {apt.promoCode && apt.discountApplied && (
                            <div className="text-xs text-primary">Code: {apt.promoCode}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewApt(apt)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => { setEditApt(apt); setEditStatus(apt.status); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteAppointment(apt._id || apt.id || '')} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search by email or name..." className="bg-secondary border-border text-foreground pl-10" />
              </div>
              <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["all", "admin", "user"].map((r) => <SelectItem key={r} value={r}>{r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["all", "active", "inactive"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowAddUser(true)} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </div>

            <div className="bg-gradient-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Email", "Full Name", "Role", "Status", "Created", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Loading users...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No users found.</td></tr>
                    ) : users.map((user) => (
                      <tr key={user._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-primary text-xs">{user.email}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{user.fullName}</td>
                        <td className="px-4 py-3"><Badge variant="outline" className={user.role === 'admin' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted text-muted-foreground'}>{user.role}</Badge></td>
                        <td className="px-4 py-3"><Badge variant="outline" className={user.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-destructive/20 text-red-400 border-destructive/30'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Switch checked={user.isActive} onCheckedChange={() => handleToggleUserStatus(user._id, user.isActive)} className="data-[state=checked]:bg-emerald-500" />
                            <button onClick={() => { setEditingUser(user); setEditUserData({ fullName: user.fullName, role: user.role, isActive: user.isActive }); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteUser(user._id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={couponSearch} onChange={(e) => setCouponSearch(e.target.value)} placeholder="Search by code..." className="bg-secondary border-border text-foreground pl-10" />
              </div>
              <Select value={couponStatusFilter} onValueChange={setCouponStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["all", "active", "inactive"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowAddCoupon(true)} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> Add Coupon
              </Button>
            </div>

            <div className="grid gap-4">
              {couponsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading coupons...</div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No coupons found.</div>
              ) : coupons.map((coupon) => (
                <motion.div key={coupon._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-lg font-mono">{coupon.code}</div>
                      <div className="text-sm text-muted-foreground">{coupon.discountPercentage}% off · Expires {new Date(coupon.expiryDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{coupon.isActive ? "Active" : "Inactive"}</span>
                      <Switch checked={coupon.isActive} onCheckedChange={() => handleToggleCouponStatus(coupon._id, coupon.isActive)} />
                    </div>
                    <button onClick={() => { setEditingCoupon(coupon); setEditCouponData({ discountPercentage: coupon.discountPercentage.toString(), expiryDate: coupon.expiryDate.split('T')[0] }); }} className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCoupon(coupon._id)} className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)} placeholder="Search by name or email..." className="bg-secondary border-border text-foreground pl-10" />
              </div>
              <Select value={reviewStatusFilter} onValueChange={setReviewStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["all", "approved", "pending"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowAddReview(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" /> Add Review
              </Button>
            </div>

            <div className="grid gap-4">
              {reviewsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No reviews found.</div>
              ) : reviews.map((review) => (
                <motion.div key={review._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-card border border-border rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-sky flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-foreground font-bold text-lg">{review.name}</div>
                        <div className="text-sm text-muted-foreground">{review.email}</div>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={review.isApproved ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{review.text}</p>
                  <div className="text-xs text-muted-foreground border-t border-border pt-3">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch checked={review.isApproved} onCheckedChange={() => handleToggleReviewApproval(review._id, review.isApproved)} className="data-[state=checked]:bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">{review.isApproved ? 'Approved' : 'Pending'}</span>
                    <button onClick={() => setViewingReview(review)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors ml-auto">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteReview(review._id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} placeholder="Search by name, email, or subject..." className="bg-secondary border-border text-foreground pl-10" />
              </div>
              <Select value={contactStatusFilter} onValueChange={setContactStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["all", "New", "Reviewed", "Responded", "Resolved"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gradient-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Email", "Subject", "Status", "Date", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contactsLoading ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Loading contacts...</td></tr>
                    ) : contacts.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No contact submissions found.</td></tr>
                    ) : contacts.filter(c => (contactStatusFilter === "all" || c.status === contactStatusFilter) && (contactSearch === "" || c.fullName.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase()) || c.subject.toLowerCase().includes(contactSearch.toLowerCase()))).map((contact) => (
                      <tr key={contact._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3"><div className="text-foreground font-medium">{contact.fullName}</div></td>
                        <td className="px-4 py-3"><div className="text-foreground text-sm">{contact.email}</div></td>
                        <td className="px-4 py-3 text-foreground text-sm">{contact.subject}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs ${contact.status === 'New' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : contact.status === 'Reviewed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : contact.status === 'Responded' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                            {contact.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelectedContact(contact)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => setEditingContact(contact)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteContact(contact._id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewApt} onOpenChange={() => setViewApt(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Appointment Details</DialogTitle>
            <DialogDescription>View the complete appointment information below</DialogDescription>
          </DialogHeader>
          {viewApt && (
            <div className="space-y-3 text-sm">
              {[["ID", viewApt.id], ["Customer", viewApt.fullName], ["Phone", viewApt.phone], ["Email", viewApt.email], ["Address", viewApt.address], ["Vehicle", `${viewApt.year} ${viewApt.make} ${viewApt.model}`], ["Category", viewApt.vehicleCategory], ["Service", viewApt.serviceType], ["Date", `${viewApt.date} at ${viewApt.timeSlot}`], ["Promo Code", viewApt.promoCode || "None"], ["Status", viewApt.status], ["Total", `$${viewApt.totalPrice.toFixed(2)}`]].map(([label, val]) => (
                <div key={label} className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="text-foreground font-medium">{val}</span></div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editApt} onOpenChange={() => setEditApt(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Appointment</DialogTitle>
            <DialogDescription>Update the appointment status</DialogDescription>
          </DialogHeader>
          {editApt && (
            <div className="space-y-4">
              <div><Label className="text-foreground">Customer</Label><Input value={editApt.fullName} disabled className="bg-secondary border-border text-muted-foreground mt-1" /></div>
              <div><Label className="text-foreground">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="bg-secondary border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">{["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditApt(null)} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={() => handleUpdateAppointment(editApt._id || editApt.id || '')} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add User</DialogTitle>
            <DialogDescription>Create a new admin or regular user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-foreground">Email</Label><Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@example.com" type="email" className="bg-secondary border-border text-foreground mt-1" /></div>
            <div><Label className="text-foreground">Full Name</Label><Input value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} placeholder="John Doe" className="bg-secondary border-border text-foreground mt-1" /></div>
            <div><Label className="text-foreground">Password</Label><Input value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} type="password" placeholder="Min 6 characters" className="bg-secondary border-border text-foreground mt-1" /></div>
            <div><Label className="text-foreground">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as 'admin' | 'user' })}>
                <SelectTrigger className="bg-secondary border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">{["user", "admin"].map((r) => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={handleCreateUser} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit User</DialogTitle>
            <DialogDescription>Update user details and permissions</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div><Label className="text-foreground">Email</Label><Input value={editingUser.email} disabled className="bg-secondary border-border text-muted-foreground mt-1" /></div>
              <div><Label className="text-foreground">Full Name</Label><Input value={editUserData.fullName} onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })} className="bg-secondary border-border text-foreground mt-1" /></div>
              <div><Label className="text-foreground">Role</Label>
                <Select value={editUserData.role} onValueChange={(value) => setEditUserData({ ...editUserData, role: value as 'admin' | 'user' })}>
                  <SelectTrigger className="bg-secondary border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">{["user", "admin"].map((r) => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editUserData.isActive} onCheckedChange={(checked) => setEditUserData({ ...editUserData, isActive: checked })} />
                <Label className="text-foreground">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={() => editingUser && handleUpdateUser(editingUser._id)} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Coupon Dialog */}
      <Dialog open={showAddCoupon} onOpenChange={setShowAddCoupon}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add Coupon</DialogTitle>
            <DialogDescription>Create a new promotional coupon code</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-foreground">Code</Label><Input value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="e.g. SUMMER20" className="bg-secondary border-border text-foreground mt-1 uppercase" /></div>
            <div><Label className="text-foreground">Discount %</Label><Input type="number" value={newCoupon.discountPercentage} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })} placeholder="e.g. 20" min="1" max="100" className="bg-secondary border-border text-foreground mt-1" /></div>
            <div><Label className="text-foreground">Expiry Date</Label><Input type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} className="bg-secondary border-border text-foreground mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCoupon(false)} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={handleCreateCoupon} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">Add Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={!!editingCoupon} onOpenChange={() => setEditingCoupon(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon discount and expiry details</DialogDescription>
          </DialogHeader>
          {editingCoupon && (
            <div className="space-y-4">
              <div><Label className="text-foreground">Code</Label><Input value={editingCoupon.code} disabled className="bg-secondary border-border text-muted-foreground mt-1" /></div>
              <div><Label className="text-foreground">Discount %</Label><Input type="number" value={editCouponData.discountPercentage} onChange={(e) => setEditCouponData({ ...editCouponData, discountPercentage: e.target.value })} min="1" max="100" className="bg-secondary border-border text-foreground mt-1" /></div>
              <div><Label className="text-foreground">Expiry Date</Label><Input type="date" value={editCouponData.expiryDate} onChange={(e) => setEditCouponData({ ...editCouponData, expiryDate: e.target.value })} className="bg-secondary border-border text-foreground mt-1" /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCoupon(null)} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={() => editingCoupon && handleUpdateCoupon(editingCoupon._id)} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contact Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Contact Details</DialogTitle>
            <DialogDescription>View the complete contact submission</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 text-sm">
              <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground font-medium">{selectedContact.fullName}</span></div>
              <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-medium">{selectedContact.email}</span></div>
              <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground font-medium">{selectedContact.phone}</span></div>
              <div><span className="text-muted-foreground">Subject:</span> <span className="text-foreground font-medium">{selectedContact.subject}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <span className="text-foreground font-medium">{selectedContact.status}</span></div>
              <div className="pt-2 border-t border-border">
                <span className="text-muted-foreground block mb-2">Message:</span>
                <p className="text-foreground bg-secondary/50 rounded p-3 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div><span className="text-muted-foreground">Submitted:</span> <span className="text-foreground font-medium">{new Date(selectedContact.createdAt).toLocaleString()}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedContact(null)} className="border-border text-muted-foreground">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Status Dialog */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Update Contact Status</DialogTitle>
            <DialogDescription>Change the status of this contact submission</DialogDescription>
          </DialogHeader>
          {editingContact && (
            <div className="space-y-4">
              <div><Label className="text-foreground">From:</Label><Input value={editingContact.fullName} disabled className="bg-secondary border-border text-muted-foreground mt-1" /></div>
              <div><Label className="text-foreground">Current Status</Label>
                <div className="mt-1 p-2 bg-secondary rounded border border-border text-foreground">{editingContact.status}</div>
              </div>
              <div><Label className="text-foreground">New Status</Label>
                <Select defaultValue={editingContact.status} onValueChange={(newStatus) => setEditingContact({ ...editingContact, status: newStatus as any })}>
                  <SelectTrigger className="bg-secondary border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {["New", "Reviewed", "Responded", "Resolved"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContact(null)} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={() => editingContact && handleUpdateContactStatus(editingContact._id, editingContact.status)} className="bg-gradient-sky text-primary-foreground font-semibold hover:opacity-90">Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Review Dialog */}
      <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create New Review</DialogTitle>
            <DialogDescription>Add a new review that will appear on the website</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Customer Name *</Label>
              <Input value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="Enter customer name" className="bg-secondary border-border text-foreground mt-1" />
            </div>
            <div>
              <Label className="text-foreground">Rating (1-5) *</Label>
              <Select value={String(newReview.rating)} onValueChange={(value) => setNewReview({ ...newReview, rating: Number(value) })}>
                <SelectTrigger className="bg-secondary border-border text-foreground mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {Array(r).fill('★').join('')} ({r}/5)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Review *</Label>
              <textarea value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} placeholder="Write the review here..." className="w-full bg-secondary border border-border text-foreground rounded-md p-2 mt-1 min-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={newReview.isApproved} onCheckedChange={(checked) => setNewReview({ ...newReview, isApproved: checked })} className="data-[state=checked]:bg-emerald-500" />
              <Label className="text-foreground cursor-pointer">Auto-approve review (show immediately on website)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddReview(false)} disabled={creatingReview} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={handleCreateReview} disabled={creatingReview} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {creatingReview ? 'Creating...' : 'Create Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Review Dialog */}
      <Dialog open={!!viewingReview} onOpenChange={() => setViewingReview(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Review Details</DialogTitle>
            <DialogDescription>View the complete review information</DialogDescription>
          </DialogHeader>
          {viewingReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-sky flex items-center justify-center text-primary-foreground font-bold">
                  {viewingReview.avatar}
                </div>
                <div>
                  <div className="text-foreground font-semibold">{viewingReview.name}</div>
                  <div className="text-sm text-muted-foreground">{viewingReview.email}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < viewingReview.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <span className="text-muted-foreground block mb-2 text-xs uppercase tracking-wider">Review</span>
                <p className="text-foreground bg-secondary/50 rounded p-3 whitespace-pre-wrap text-sm">{viewingReview.text}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="text-foreground font-medium">{new Date(viewingReview.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className={viewingReview.isApproved ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                  {viewingReview.isApproved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingReview(null)} className="border-border text-muted-foreground">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.type !== null} onOpenChange={() => setDeleteConfirm({ type: null, id: '' })}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-red-400">Confirm Deletion</DialogTitle>
            <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            You are about to permanently delete this {deleteConfirm.type}. This cannot be reversed.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm({ type: null, id: '' })} disabled={isDeleting} className="border-border text-muted-foreground">Cancel</Button>
            <Button onClick={confirmDelete} disabled={isDeleting} className="bg-red-500 text-white hover:bg-red-600">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
