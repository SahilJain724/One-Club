import React, { useState } from "react";
import Spinner from "../Utils/Spinner";

const ConfirmAddressModal = ({
  mode,
  address,
  regAddress,
  handleAddressSubmit,
  onSave,
  onClose,
  onConfirm,
  userDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const isConfirm = mode === "confirm";

  const baseClasses = "border px-3.5 py-1.5 rounded w-full";
  const readOnlyClasses = "bg-gray-100 text-gray-500 cursor-not-allowed";

  // Wrapper to handle loading state
  const submitHandler = (fn) => async (data) => {
    setLoading(true);
    try {
      await fn(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute right-4 top-2 text-xl">×</button>
        <h2 className="text-xl font-semibold mb-4">
          {isConfirm ? "Confirm Order Details" : mode === "add" ? "Add New Address" : "Update Address"}
        </h2>

        <form
          onSubmit={handleAddressSubmit(isConfirm ? submitHandler(onConfirm) : submitHandler(onSave))}
          className="flex flex-col gap-3"
        >
          {isConfirm && (
            <>
              <input
                {...regAddress("name", { required: "Receiver name is required" })}
                defaultValue={userDetails.name}
                placeholder="Receiver Name"
                autoComplete="name"
                className={baseClasses}
              />
              <input
                {...regAddress("phone", { required: "Receiver phone is required" })}
                defaultValue={userDetails.phone}
                placeholder="Receiver Phone"
                autoComplete="tel"
                className={baseClasses}
              />
            </>
          )}

          <input
            {...regAddress("street", { required: !isConfirm && "Street is required" })}
            defaultValue={address.street}
            placeholder="Street"
            readOnly={isConfirm}
            className={`${baseClasses} ${isConfirm ? readOnlyClasses : ""}`}
          />
          <input
            {...regAddress("city", { required: !isConfirm && "City is required" })}
            defaultValue={address.city}
            placeholder="City"
            readOnly={isConfirm}
            className={`${baseClasses} ${isConfirm ? readOnlyClasses : ""}`}
          />
          <input
            {...regAddress("state", { required: !isConfirm && "State is required" })}
            defaultValue={address.state}
            placeholder="State"
            readOnly={isConfirm}
            className={`${baseClasses} ${isConfirm ? readOnlyClasses : ""}`}
          />
          <input
            {...regAddress("zip", { required: !isConfirm && "Zipcode is required" })}
            defaultValue={address.zip}
            placeholder="Zipcode"
            readOnly={isConfirm}
            className={`${baseClasses} ${isConfirm ? readOnlyClasses : ""}`}
          />
          <input
            {...regAddress("country", { required: !isConfirm && "Country is required" })}
            defaultValue={address.country}
            placeholder="Country"
            readOnly={isConfirm}
            className={`${baseClasses} ${isConfirm ? readOnlyClasses : ""}`}
          />
          <textarea
            {...regAddress("landmarks")}
            defaultValue={address.landmarks}
            placeholder="Landmarks"
            readOnly={isConfirm}
            className={`${baseClasses} resize-none ${isConfirm ? readOnlyClasses : ""}`}
          />

          <div className="flex justify-center mt-4">
            {!loading && (
              <button
                type="submit"
                className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white text-sm py-2 px-4 rounded-full"
              >
                {isConfirm ? "Confirm Order" : mode === "add" ? "Add Address" : "Update Address"}
              </button>
            )}
          </div>

          {/* Spinner below form, centered */}
          {loading && (
            <div className="flex justify-center mt-4">
              <Spinner />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConfirmAddressModal;
