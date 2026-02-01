export default function Input({
  label,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}) {
  return (
    <div className="text-left">
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        )}

        <input
          className="w-full border border-black py-3 pl-10 pr-10 text-sm focus:border-black focus:outline-none"
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
