import { useEffect, useState } from "react";

const Default = ({
  title,
  type = "text",
  disable = false,
  initialValue,
  func,
}) => {
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const handleChange = (e) => {
    const val = type === "number" ? Number(e.target.value) : e.target.value;
    setValue(val);
    func(val);
  };

  return (
    <div className="mt-3 w-full">
      <label className="text-lg font-bold block mb-1">{title}</label>
      <input
        lang="fr"
        disabled={disable}
        type={type}
        value={value}
        onChange={handleChange}
        className="input w-full"
      />
    </div>
  );
};

export default Default;
