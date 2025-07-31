import { useEffect, useRef, useState } from "react";
import { useStatus } from "@/components/v2/core/useStatus";

const Status = () => {
  const ref = useRef(null);
  const { message, type, clear } = useStatus();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      ref.current?.classList.remove("hidden");

      const timer = setTimeout(() => {
        setVisible(false);
        clear();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, clear]);

  if (!message || !type) return null;

  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 w-full h-10 z-[999] flex items-center justify-center text-white font-bold transition-all ease-in-out duration-200
        ${visible ? "translate-y-0" : "-translate-y-full"}
        ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
    >
      {message}
    </div>
  );
};

export default Status;
