import Title from '../Utils/Title';

const CartTotal = ({ totalAmount }) => {
  const shippingThreshold = 201;
  const originalShippingFee = 25;
  const shippingFee = totalAmount > shippingThreshold ? 0 : originalShippingFee;
  const remainingForFreeShipping = shippingThreshold - totalAmount;
  const finalTotal = totalAmount + shippingFee;



  return (
      <div className="w-full text-base">
        {/* Title */}
        <div className="text-2xl mb-2">
          <Title text1="CART" text2="TOTAL" />
        </div>

        {/* Subtotal */}
        <div className="flex justify-between mb-2">
          <p className="text-lg">Subtotal</p>
          <p className="text-lg">₹ {totalAmount.toLocaleString()}</p>
        </div>

        {/* Notice for free shipping */}
        {totalAmount <= shippingThreshold && (
          <div className="mt-2 text-yellow-800 bg-yellow-100 border border-yellow-300 px-3 py-2 rounded text-sm">
           
            Add ₹{totalAmount===200?1:remainingForFreeShipping.toLocaleString()} more to get free shipping!
           
          </div>
        )}

        <hr className="my-3" />

        {/* Shipping fee */}
        <div className="flex justify-between mb-2">
          <p className="text-lg">Shipping Fee</p>
          <p className="text-lg">
            {shippingFee === 0 ? (
              <>
                <span className="line-through text-green-500 mr-1">₹ {originalShippingFee}</span> ₹ 0
              </>
            ) : (
              <>₹ {shippingFee.toLocaleString()}</>
            )}
          </p>
        </div>

        {/* Congrats message */}
        {totalAmount > shippingThreshold && (
          <div className="mt-2 text-green-800 bg-green-100 border border-green-300 px-3 py-2 rounded text-sm">
            Congrats! You got free shipping.
          </div>
        )}

        <hr className="my-3" />

        {/* Final total */}
        <div className="flex justify-between font-semibold text-xl">
          <p>Amount to pay</p>
          <p>₹ {finalTotal.toLocaleString()}</p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-600 mt-2 italic">
          * All taxes and GST included.
        </p>
      </div>
    
  );
};

export default CartTotal;
