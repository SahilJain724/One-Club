import Title from "./Title";

const AddressList = ({
  addresses,
  selectedAddressId,
  onSelect,
  onDelete,
  onProceed,
  onAddNew,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <Title text1="YOUR" text2="SAVED ADDRESSES" />
        <div className="flex gap-2">
          <button
            onClick={onAddNew}
            className="bg-gradient-to-r from-green-800 to-green-500 hover:scale-103 duration-200 text-white text-sm py-2 px-4 rounded-full"
          >
             + Add New Address
          </button>
          <button
            onClick={onProceed}
            className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white text-sm py-2 px-4 rounded-full"
          >
            Proceed to Payment!
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses found.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex items-start gap-3 rounded p-3 border ${addr.id === selectedAddressId ? "border-black shadow" : ""
                }`}
            >
              {/* Custom styled radio */}
              <input
                type="radio"
                name="defaultAddress"
                checked={addr.id === selectedAddressId}
                onChange={() => onSelect(addr.id)}
                className={`
                  mt-1 w-4 h-4 rounded-full border border-gray-400
                  cursor-pointer
                  checked:bg-black checked:border-black
                  focus:outline-none
                `}
              />

              <div className="flex-1">
                <p>
                  {addr.street}, {addr.city},
                  <br />{addr.state}- {addr.zip}
                  <br />{addr.country}
                </p>

                <p className="text-sm text-gray-600">
                  Landmarks: {addr.landmarks}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onEdit(addr)}
                    className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white text-xs py-1 px-4 rounded-full"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(addr.id)}
                    className="bg-gradient-to-r from-red-800 to-red-500 hover:scale-103 duration-200 text-white text-xs py-1 px-4 rounded-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressList;