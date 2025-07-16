"use client"; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type SidebarNavItemProps = {
  href: string;
  label: string;
  children: React.ReactNode; 
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ href, label, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-yellow-400 text-white font-semibold shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {children}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default SidebarNavItem;