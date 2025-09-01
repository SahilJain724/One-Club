const CartItem = ({ item, updateQuantity,removeItem }) => (
  <div className="relative flex justify-between items-center border-white rounded shadow mb-4 hover:shadow-lg transition-transform hover:scale-101 p-4">
   <button
  onClick={() => removeItem(item.id)}
  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg font-semibold"
  aria-label="Remove item"
>
  ×
</button>


    <div className="flex items-center min-w-0">
      <img
        src={item.image}
        onError={(e) => { e.target.src = "https://i.ibb.co/YTZn5gQL/p-img8.png"; }}
        alt={item.title}
        className="w-16 h-16 object-contain mr-4 flex-shrink-0"
      />
      <div className="min-w-0">
        <p className="font-medium truncate max-w-[200px]">{item.title}</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center bg-gray-100 rounded px-2 py-1 shadow-sm h-8">
            <button
              onClick={() => updateQuantity(item.id, "decrease")}
              className="text-lg px-2 hover:text-red-600"
            >
              −
            </button>
            <span className="bg-black text-white font-medium px-3 rounded text-sm flex items-center justify-center h-full">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, "increase")}
              className="text-lg px-2 hover:text-green-600"
            >
              +
            </button>
          </div>
          <pre className="text-sm font-semibold text-black mx-3">x ₹ {item.price}</pre>
        </div>
      </div>
    </div>
    <div className="flex-shrink-0">
      <p className="text-base font-semibold text-black text-right min-w-[110px]">
        ₹ {(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  </div>
);

export default CartItem;