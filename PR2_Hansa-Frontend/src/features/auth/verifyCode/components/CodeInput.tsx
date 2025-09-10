import React, { useRef } from "react";

interface CodeInputProps {
  code: string[];
  setCode: (code: string[]) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (code[index] === "") {
        if (index > 0) {
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;

    const newCode = Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
      }
    });
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {code.map((digit, index) => (
        <input
          key={index}
          id={`code-${index}`}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          defaultValue={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center border border-gray-300 rounded-md text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
        />
      ))}
    </div>
  );
};

export default CodeInput;