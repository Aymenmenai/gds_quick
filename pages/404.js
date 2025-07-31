import { useRouter } from "next/router";
import React from "react";

const Error = () => {
  // const router = useRouter()
  return (
    <div>
      {/* there are no {router.asPath} */}
      {"?"}
    </div>
  );
};

export default Error;
