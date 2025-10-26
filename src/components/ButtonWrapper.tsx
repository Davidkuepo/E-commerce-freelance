type Props = {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant: "warn" | "accent" | "default" | "neutral";
};

const variants = {
  warn: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  accent: "bg-pink-600 hover:bg-pink-700 text-white focus:ring-pink-500",
  default: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500",
  neutral: "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400",
};

export default function ButtonWrapper({
  variant,
  loading,
  disabled,
  type,
  children,
}: Props) {
  return (
    <button
      type={type || "button"}
      disabled={disabled || loading}
      className={`
        font-medium text-sm sm:text-base transition-all
        focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm 
        inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg 
        disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]}
    `}
    >
      {loading && (
        <span className="loading loading-spinner loading-sm text-white"></span>
      )}
      {children}
    </button>
  );
}
