import { User, Role } from "@prisma/client";

type SafeUser = Omit<User, 'passwordHash'>;

interface UserTableProps {
  users: SafeUser[];
  onEdit: (user: SafeUser) => void;
  onDelete: (id: bigint) => void; 
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const getRoleBadge = (role: Role) => {
    const baseStyle = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (role) {
      case 'ADMIN':
        return <span className={`${baseStyle} bg-purple-100 text-purple-800`}>Admin</span>;
      case 'PARTNER':
        return <span className={`${baseStyle} bg-blue-100 text-blue-800`}>Partner</span>;
      case 'USER':
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>User</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No. Telepon</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bergabung pada</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id.toString()}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getRoleBadge(user.role)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.phoneNumber || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="px-3 py-1 text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="px-3 py-1 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}