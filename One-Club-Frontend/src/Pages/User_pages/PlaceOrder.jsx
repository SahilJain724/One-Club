import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Title from "../../Components/User_components/Utils/Title";
import AddressList from "../../Components/User_components/Utils/AddressList";
import ConfirmAddressModal from "../../Components/User_components/Modals/ConfirmAddressModal";

const PlaceOrder = () => {
  const {
    register: regAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
  } = useForm();

  const {
    register: regConfirm,
    handleSubmit: handleConfirmSubmit,
    reset: resetConfirmForm,
  } = useForm();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [userDetails, setUserDetails] = useState({ name: "", phone: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:9000/users/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
      const defaultAddr = res.data.find((a) => a.defaultAddress === 1);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch {
      toast.error("Could not load addresses");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token, fetchAddresses]);

  const handleAddNew = () => {
    setEditAddress(null);
    setModalMode("add");
    resetAddressForm();
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    setModalMode("update");
    resetAddressForm(address);
    setShowModal(true);
  };

  const handleProceed = async () => {
    if (!selectedAddressId) return toast.error("Please select an address first");
    try {
      const res = await axios.get("http://localhost:9000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails({ name: res.data.name, phone: res.data.phone });
      resetConfirmForm({ name: res.data.name, phone: res.data.phone });

      const defaultAddr = addresses.find((a) => a.id === selectedAddressId);
      if (defaultAddr) setEditAddress(defaultAddr);

      setModalMode("confirm");
      setShowModal(true);
    } catch {
      toast.error("Failed to load user details");
    }
  };

  const handleConfirmDetails = async (formData) => {
    try {
      const orderData = {
        id: selectedAddressId,
        street: editAddress.street,
        city: editAddress.city,
        state: editAddress.state,
        country: editAddress.country,
        zip: editAddress.zip,
        landmarks: editAddress.landmarks,
        isDefault: editAddress.defaultAddress || 0,
        receiverName: formData.name,
        receiverPhone: formData.phone,
      };

      const response = await axios.post(
        "http://localhost:9000/orders/place",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payment = response.data;

      const options = {
        key: "rzp_test_pHm8jDmhjrJhuo",
        amount: payment.amount * 100,
        currency: "INR",
        name: "OneClub",
        description: "Order Payment",
        order_id: payment.razorpayOrderId,
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: { color: "#080808ff" },
        handler: async function (response) {
          try {
            await axios.patch(
              `http://localhost:9000/payments/success/${payment.paymentId}`,
              null,
              {
                params: { razorpayPaymentId: response.razorpay_payment_id },
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            toast.success("Payment successful & status updated!");
            navigate("/orderHistory");
          } catch (err) {
            console.error(err);
            toast.error("Payment succeeded, but failed to update status.");
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await axios.patch(
                `http://localhost:9000/payments/failed/${payment.paymentId}`,
                null,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              toast.info("Payment was cancelled; order cancelled too.");
            } catch (err) {
              console.error(err);
              toast.error("Failed to mark payment/order as failed.");
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order or open payment.");
    }
  };

  const onAddAddress = async (formData) => {
    try {
      if (!formData.street || !formData.city || !formData.state || !formData.country || !formData.zip) {
        toast.error("Please fill all required fields");
        return;
      }

      await axios.post("http://localhost:9000/users/add/address", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      resetAddressForm();
      fetchAddresses();
      toast.success("Address added!");
    } catch {
      toast.error("Could not add address");
    }
  };

  const onUpdateAddress = async (formData) => {
    try {
      await axios.patch(
        "http://localhost:9000/users/update/address",
        { id: editAddress.id, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      resetAddressForm();
      fetchAddresses();
      toast.success("Address updated!");
    } catch {
      toast.error("Could not update address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:9000/users/delete/address/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
      toast.success("Address deleted!");
    } catch {
      toast.error("Could not delete address");
    }
  };

  const handleSelectDefault = async (addressId) => {
    try {
      await axios.patch(`http://localhost:9000/users/address/set-default/${addressId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedAddressId(addressId);
      fetchAddresses();
      toast.success("Default address updated!");
    } catch {
      toast.error("Failed to set default address");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <Title text1="" text2="SELECT AN ADDRESS TO PROCEED WITH" />
      <AddressList
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={handleSelectDefault}
        onEdit={handleEdit}
        onDelete={handleDeleteAddress}
        onProceed={handleProceed}
        onAddNew={handleAddNew}
      />
      {showModal && (
        <ConfirmAddressModal
          mode={modalMode}
          address={editAddress || {}}
          regAddress={modalMode === "confirm" ? regConfirm : regAddress}
          handleAddressSubmit={modalMode === "confirm" ? handleConfirmSubmit : handleAddressSubmit}
          onSave={modalMode === "add" ? onAddAddress : onUpdateAddress}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDetails}
          userDetails={userDetails}
        />
      )}
    </div>
  );
};

export default PlaceOrder;