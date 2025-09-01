const Spinner = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring (clockwise) */}
      <div className="w-14 h-14 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></div>

      {/* Inner ring (counter-clockwise) */}
      <div className="absolute w-7 h-7 rounded-full border-3 border-black border-b-transparent animate-spin [animation-direction:reverse]"></div>
    </div>
  );
};

export default Spinner;
