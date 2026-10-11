import Navbar from "@/components/store/layouts/Navbar/Navbar";
import Footer from "@/components/store/layouts/footer/Footer";
import { NotFoundContent } from "@/components/store/not-found/not-found-content";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#fafbfa]">
      <Navbar />
      <NotFoundContent />
      <Footer />
    </div>
  );
}

