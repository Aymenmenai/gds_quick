import content from "@/components/v2/data/tools/entree.json";
import ShowTable from "@/components/v2/components/show-table";
export default function Home() {
  const router = {
    name: "Entree",
    field: "/entree",
    show: true,
    edit: false,
    delete: true,
  };

  return <ShowTable router={router} content={content} />;
}
