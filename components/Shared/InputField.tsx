import React from "react";

interface InputFieldProps {
  type?: "text" | "email" | "password";
  name?: string,
  placeholder?: string;
  style?:string;
  onChange?: any;
  value?:any;
  onBlur?: any;
  key?:any
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "",
  name ="",
  onChange= ()=>{},
  value = ()=>{},
  onBlur= ()=>{},
  key,
  style 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      className={`w-full rounded-md px-4 py-2 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39b694bf] ${style}`}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      key={key}
    />
  );
};

export default InputField;
