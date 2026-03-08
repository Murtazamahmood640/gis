import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useCardHoverEffect from "@/hooks/useCardHoverEffect";

export default function Layout() {
  useCardHoverEffect();

  return (
    <div className="min-h-screen bg-background flex flex-col relative z-10">
      <Navbar />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
