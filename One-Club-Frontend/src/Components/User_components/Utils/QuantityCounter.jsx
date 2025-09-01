const QuantityCounter = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center bg-gray-100 rounded shadow h-8">
    <button
      onClick={onDecrease}
      className="w-8 flex justify-center items-center text-lg hover:text-red-600"
    >
      −
    </button>
    <span className="w-8 flex justify-center items-center bg-black text-white rounded text-sm">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="w-8 flex justify-center items-center text-lg hover:text-green-600"
    >
      +
    </button>
  </div>
);

export default QuantityCounter;
