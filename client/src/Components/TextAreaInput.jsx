import React from "react";

const TextAreaInput = ({
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
        <textarea
          id={id}
          rows={5}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
        />
      </div>
      {error && <p className="text-sm text-red-500">{errorText}</p>}
    </div>
  );
};

export default TextAreaInput;
