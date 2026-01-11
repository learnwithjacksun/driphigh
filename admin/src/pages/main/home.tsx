import { MainLayout } from "@/layouts";
import { Hero, Featured, About, PlatformFeatures, Contact } from "@/components/main";
  export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Featured />
      <About />
      <PlatformFeatures />
      <Contact />
    </MainLayout>
  )
}
