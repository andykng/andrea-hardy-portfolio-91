
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background antialiased">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};
