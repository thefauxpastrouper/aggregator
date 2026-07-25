import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Delhi University (DU)', path: '/du' },
    { name: 'Jawaharlal Nehru University (JNU)', path: '/jnu' },
    { name: 'Banaras Hindu University (BHU)', path: '/bhu' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">EduNotice</Link>
          <nav className="flex space-x-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cx(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-emerald-700 text-white" 
                      : "text-emerald-100 hover:bg-emerald-500 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EduNotice Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
