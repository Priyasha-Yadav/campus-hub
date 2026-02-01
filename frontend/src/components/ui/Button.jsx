export default function Button({ children, ...props }) {
  return (
    <button
      className="mt-2 w-full bg-black py-3 text-white rounded-lg font-medium hover:opacity-90 transition"
      {...props}
    >
      {children}
    </button>
  );
}
