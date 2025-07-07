import HeaderDesktop from "@/layout/Header";
import HeaderMobile from "@/layout/HeaderMobile";
import Footer from "@/layout/Footer";
import { RouteSectionProps } from "@solidjs/router";
import CarritoDesplegable from '@/components/Carrito/CarritoDesplegable';
import Toast from "@/components/ui/Toast";

export default function LayoutPublic(props: RouteSectionProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <div class="hidden lg:block">
        <HeaderDesktop />
      </div>
      <div class="lg:hidden">
        <HeaderMobile />
      </div>

      <Toast />
      <CarritoDesplegable />
      <main class="flex-1">{props.children}</main>
      <Footer />
    </div>
  );
}
