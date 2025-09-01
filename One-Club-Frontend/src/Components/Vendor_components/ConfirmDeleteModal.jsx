const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-6">Are you sure you want to delete this product?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="border border-gray-400 px-4 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
  
  export default ConfirmDeleteModal;  