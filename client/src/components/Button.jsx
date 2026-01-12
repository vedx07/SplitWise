export default function Button({ children, variant = "outline", ...props }) {
  const base =
    "px-3 py-1.5 rounded-md text-sm font-medium transition border";

  const variants = {
    outline:
      "border-[#242a33] text-gray-300 hover:bg-[#161b22]",
    primary:
      "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    success:
      "bg-green-600 border-green-600 text-white hover:bg-green-700",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
