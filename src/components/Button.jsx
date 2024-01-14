const Button = ({ title, className, disabled, onClick, type }) => {
  return (
    <button
      type={type || "button"}
      className={`border-none outline-none transition px-3 py-2 rounded-lg ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
