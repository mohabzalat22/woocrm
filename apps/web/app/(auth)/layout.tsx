import { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
export default function AuthLayout({children}:{children: ReactNode}) {
  return (
    <div className="container mx-auto p-2">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}