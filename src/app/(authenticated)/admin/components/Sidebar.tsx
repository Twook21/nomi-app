import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Handshake, 
  Package, 
  ShoppingCart, 
  Tags 
} from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

const navItems = [
  { href: '/admin', icon: <LayoutDashboard className="h-5 w-5 mr-3" />, label: 'Dashboard' },
  { href: '/admin/partners', icon: <Handshake className="h-5 w-5 mr-3" />, label: 'Manajemen Mitra' },
  { href: '/admin/users', icon: <Users className="h-5 w-5 mr-3" />, label: 'Manajemen Pengguna' },
  { href: '/admin/products', icon: <Package className="h-5 w-5 mr-3" />, label: 'Manajemen Produk' },
  { href: '/admin/orders', icon: <ShoppingCart className="h-5 w-5 mr-3" />, label: 'Manajemen Pesanan' },
  { href: '/admin/categories', icon: <Tags className="h-5 w-5 mr-3" />, label: 'Manajemen Kategori' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <Link href="/admin">
          <span className="text-2xl font-bold text-yellow-500">ADMIN</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <SidebarNavItem key={item.href} href={item.href} label={item.label}>
              {item.icon}
            </SidebarNavItem>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;