import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
