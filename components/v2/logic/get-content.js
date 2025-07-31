import { useEffect, useState } from "react";

export const useContent = (folder, content) => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await import(
          `@/components/v2/data/${folder}${content}.json`
        );
        setData(result.default);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, [folder, content]);

  return data;
};
