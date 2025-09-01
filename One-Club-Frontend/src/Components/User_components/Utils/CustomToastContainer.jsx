const CustomToastContainer = ({ messages }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning from One Club!";
    if (hour < 17) return "Good Afternoon from One Club!";
    if (hour < 21) return "Good Evening from One Club!";
    return "Good Night from One Club!";
  };

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <p
            key={msg.tId || `toast-${index}`}
            className={`font-semibold ${msg.type === "success" || msg.type === "error"
                ? "text-white"
                : "text-black"
              }`}
          >

            {msg.content || msg.message || "No content"}
          </p>
        ))
      ) : (
        <p className="font-semibold text-black">{getGreeting()}</p>
      )}
    </div>
  );
};

export default CustomToastContainer;
