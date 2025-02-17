import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, productName }) => {
  if (!isOpen) return null; // If the modal is closed, return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="text-xs bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="font-semibold mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the product: <strong>{productName}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition"
            onClick={onCancel}
          >
            Cancel
                  </button>
                  <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
