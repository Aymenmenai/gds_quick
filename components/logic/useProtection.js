import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useProtection = () => {
  const router = useRouter();
  // const fill = useAuthStore((state) => state.fill);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/v1/auth/check");
        // fill(response.data);
      } catch (error) {
        router.push("/login");
        // console.log("USER IS NOT AUTHENTICATED !!!");
      }
    };

    checkAuth();
  }, []);

  return null;
};

export default useProtection;
