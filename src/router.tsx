import { createBrowserRouter, Outlet, NavLink } from 'react-router';
import { MedicationListPage } from './pages/MedicationListPage';
import { MedicationDetailPage } from './pages/MedicationDetailPage';
import { MyKitPage } from './pages/MyKitPage';
import { AboutPage } from './pages/AboutPage';
import { InteractionCheckerPage } from './pages/InteractionCheckerPage';

const MainLayout = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `btn btn-ghost ${isActive ? 'text-primary border-b-2 border-primary rounded-none' : ''}`;

  return (
    <div className="min-h-screen bg-base-200 font-sans">
      <header className="navbar bg-base-100 shadow-sm px-6 sticky top-0 z-50">
        <div className="flex-1">
          <NavLink to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <img src="/icon.png" alt="MedHub Logo" className="w-7 h-7 object-contain" />
            <span>MedHub</span>
          </NavLink>
        </div>
        <div className="flex-none gap-2 hidden sm:flex">
          <NavLink to="/" className={navClass}>หน้าหลัก</NavLink>
          <NavLink to="/checker" className={navClass}>เช็คปฏิกิริยายา</NavLink>
          <NavLink to="/my-kit" className={navClass}>กระเป๋ายา</NavLink>
          <NavLink to="/about" className={navClass}>เกี่ยวกับเรา</NavLink>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <MedicationListPage /> },
      { path: 'medication/:id', element: <MedicationDetailPage /> },
      { path: 'checker', element: <InteractionCheckerPage /> },
      { path: 'my-kit', element: <MyKitPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);