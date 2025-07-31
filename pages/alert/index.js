// import React from "react";
// import Article from "@/components/root/articles/table";

// const Index = () => {
//   return <Article />;
// };

// export default Index;
import content from "@/components/v2/data/tools/stock.json";
import ShowTable from "@/components/v2/components/show-table";

export default function Home() {
  const router = {
    name: "Ref",
    field: "/ref",
    show: false,
    edit: false,
    delete: true,
  };
  return <ShowTable router={router} content={content} />;
}
