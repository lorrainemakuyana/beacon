import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="min-h-screen w-full py-8">
        <div className="max-w-5xl w-full mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </>
  );
}
