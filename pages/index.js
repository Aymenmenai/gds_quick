import Pagination from "@/components/v2/app/build/pagination";
import useURL from "@/components/v2/core/useURL";
import { catchAsync } from "@/components/v2/logic/catchAsync";
import content from "@/components/v2/data/tools/entree.json";
import { useEffect, useState } from "react";
import { limit } from "@/components/v2/global/variable";
import Loading from "@/components/v2/app/containers/loading";
import { useStatus } from "@/components/v2/core/useStatus";
import Table from "@/components/v2/app/build/table";
import Tools from "@/components/v2/app/build/tools";

export default function Home() {
  const { type } = useStatus();
  const api = useURL((state) => state);

  const [data, setData] = useState(null);
  const [select, setSelect] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);

  const router = {
    name: "Entree",
    field: "/entree",
    show: true,
    edit: false,
    delete: true,
  };
  // const routes = [
  //   { name: "Entree", field: "/entree", show: true, edit: false, delete: true },
  //   {
  //     name: "Stock real",
  //     field: "/ref",
  //     show: false,
  //     edit: false,
  //     delete: false,
  //     history: true,
  //   },
  //   { name: "Sortie", field: "/sortie", show: true, edit: false, delete: true },
  //   {
  //     name: "Article d'entree",
  //     field: "/article",
  //     show: false,
  //     edit: true,
  //     delete: true,
  //   },
  //   {
  //     name: "Article sortant",
  //     field: "/articlequisort",
  //     show: false,
  //     edit: true,
  //     delete: true,
  //   },
  //   {
  //     name: "Sortie Gasoil",
  //     field: "/gasoilsortie",
  //     show: true,
  //     edit: false,
  //     delete: true,
  //   },
  // ];

  useEffect(() => {
    if (content) {
      api.init(content.default_url);
    }
  }, [content]);

  useEffect(() => {
    const urlReady =
      typeof api.request.url === "string" && api.request.url.length > 0;
    const routeReady =
      typeof api.request.route === "string" && api.request.route.length > 0;
    const contentReady = content && Array.isArray(content.default_url.fields);
    const includeReady = content?.default_url?.include !== undefined;

    const shouldFetch = urlReady && routeReady && contentReady && includeReady;

    if (shouldFetch) {
      fetchData();
    }
  }, [api.request.url, api.request.route, content, type === "success"]);

  const fetchData = catchAsync(async () => {
    setSelect([]);
    if (!api.request.url || !content.default_url?.include) return;

    const res = await fetch(api.request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        include: content.default_url.include,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      setData(result);
    }
  });

  const toggleSelect = (id) => {
    setSelect((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const excel_handler = catchAsync(async () => {
    setSelect([]);
    if (!api.request.url || !content.default_url?.include) return;

    const url =
      api.request.url.split("?")[0] +
      "/export?" +
      api.request.url.split("?")[1];

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        include: content.default_url.include,
        headers: api.request.fields.filter((a) => a.active),
      }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "export.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } else {
      console.error("❌ Failed to fetch Excel export");
    }
  });

  if (!content) {
    return <Loading />;
  }

  return (
    <div className="h-[90svh] px-3">
      <div className="bg-white py-4 rounded-xl flex flex-col size-full border border-gray-300/60 overflow-hidden">
        {/* <MenuTabs routes={routes} /> */}
        <Tools
          refetch={fetchData}
          clean={() => api.init(content.default_url)}
          detail={() => {
            select.length > 0 && setDetailOpen(true);
          }}
          exporting={excel_handler}
          tools={content}
        />
        <div className="flex flex-col justify-start items-start gap-1 h-full bg-yellow-600/0">
          {!data ? (
            <Loading />
          ) : (
            <>
              {data.data ? (
                <div className="flex-1 bg-teal-300/0 relative w-full ring-1 ring-blue-100 overflow-hidden flex flex-col">
                  <div className="overflow-y-scroll relative size-full">
                    <Table
                      setSelect={toggleSelect}
                      select={select}
                      data={data.data}
                      size={data.size > limit}
                      show={router.show}
                      remove={router?.delete}
                      edit={content.edit}
                      add={content.add}
                      history={!!router?.history}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full grid place-items-center">
                  Aucune donnée
                </div>
              )}
              {data.size > limit && (
                <Pagination size={Math.ceil(data.size / limit)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
