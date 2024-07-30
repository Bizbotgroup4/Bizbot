import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const CreatableInput = ({
  id,
  label,
  placeholder,
  name,
  value,
  setValue,
  error,
  errorText,
}) => {
  const createOption = (label) => ({
    label,
    value: label,
  });
  const [inputValue, setInputValue] = React.useState("");
  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue(name, [...value, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
        break;

      default:
      // do nothing
    }
  };
  const components = {
    DropdownIndicator: null,
  };
  const styles = {
    valueContainer: (base) => ({
      ...base,
      width: "100px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      borderRadius: "6px",
    }),
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#a855f7" : "",
      borderRadius: "6px",
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#a855f7" : "",
      },
    }),
  };
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 capitalize">
          {label}
        </label>
      )}
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        id={id}
        menuIsOpen={false}
        styles={styles}
        onChange={(newValue) => setValue(name, newValue)}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        value={value}
        className="mt-2"
      />
      {error && <p className="text-red-500 text-sm">{errorText}</p>}
    </div>
  );
};

export default CreatableInput;
