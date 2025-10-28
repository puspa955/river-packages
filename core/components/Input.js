import { Input as DefaultInput } from "../library/input";
import React, { useEffect, useState } from "react";

const Input = ({ defaultValue, ...rest }) => {
  const [text, setText] = useState(defaultValue);
  useEffect(() => {
    setText(defaultValue);
  }, [defaultValue]);
  return (
    <DefaultInput value={text} onChange={(e) => setText(e.target.value)} {...rest} />
  );
};

export default Input;
