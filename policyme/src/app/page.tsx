import { Navbar } from "@/components/layout/Navbar";
import { Header84 } from "@/components/home/Header84";
import { Layout423 } from "@/components/home/Layout423";
import { Layout22 } from "@/components/home/Layout22";
import { Layout503 } from "@/components/home/Layout503";
import { Stats29 } from "@/components/home/Stats29";
import { Testimonial13 } from "@/components/home/Testimonial13";
import { Pricing6 } from "@/components/home/Pricing6";
import { Cta25 } from "@/components/home/Cta25";
import { Faq4 } from "@/components/home/Faq4";
import { Footer7 } from "@/components/home/Footer7";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 text-foreground overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-[100vw] pt-16">
        <Header84 />
        <Layout423 />
        <Layout22 />
        <Layout503 />
        <Stats29 />
        <Testimonial13 />
        <Pricing6 />
        <Cta25 />
        <Faq4 />
      </main>
      <Footer7 />
    </div>
  );
}
