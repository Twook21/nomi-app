import Link from 'next/link';
import { ArrowRight, ShieldCheck, User } from 'lucide-react';
import { mockUsers } from '@/lib/data';

export default function UserListPage() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            
            <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-5">
                Manajemen Pengguna
            </h1>

            <div className="flow-root">
                <div className="-my-2 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockUsers.map((user) => (
                        <Link 
                            key={user.id} 
                            href={`/pengguna/${user.id}`}
                            className="flex items-center justify-between py-4 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                               <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                                   {user.role === 'admin' ? 
                                     <ShieldCheck className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                                     <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                               </div>
                               <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                        {user.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </p>
                               </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    user.role === 'admin' 
                                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' 
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                                }`}>
                                    {user.role}
                                </span>
                                <ArrowRight className="h-5 w-5 text-gray-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}