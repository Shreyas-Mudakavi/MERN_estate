const Button = ({ title, className, disabled, onClick }) => {
  return (
    <button
      className={`border-none outline-none transition px-3 py-2 rounded-lg ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
