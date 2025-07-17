'use client';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirmation({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus produk "<strong>{itemName}</strong>"? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2">
            Batal
          </button>
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}