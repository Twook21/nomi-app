import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartSummaryDialog } from "@/components/cart/CartSummaryDialog";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <CartSummaryDialog />
      <Toaster richColors position="top-center" />
    </>
  );
}
