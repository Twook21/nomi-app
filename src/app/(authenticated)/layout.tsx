import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster richColors position="top-center" />
    </>
  );
}
