import React from "react";

const TextInput = ({
  name,
  type,
  id,
  label,
  error,
  errorText,
  onChange,
  value,
  placeholder,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900 capitalize"
        >
          {label}
        </label>
      </div>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full pl-2 rounded-md py-1.5 text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-0 focus:outline-purple-500 focus:outline-0 outline-0 border focus:border-purple-500 sm:text-sm sm:leading-6"
        />
      </div>
      {error && <p className="text-sm text-red-500">{errorText}</p>}
    </div>
  );
};

export default TextInput;
