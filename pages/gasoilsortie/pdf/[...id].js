import Loading from "@/components/interface/loading/loading";
import GasoilPdf from "@/components/base/pdf/gasoil-pdf";
import { useRouter } from "next/router";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

function paginateGasoilElements(groupedData, pageSize = 16) {
  const flatArray = Object.entries(groupedData).map(([date, elements]) => ({
    date,
    elements: [...elements], // Clone to avoid mutating original data
  }));

  const pages = [];
  let currentPage = {};
  let currentCount = 0;

  for (let { date, elements } of flatArray) {
    if (!date) {
      console.warn("Skipping undefined date in pagination:", elements);
      continue;
    }

    while (elements.length > 0) {
      const take = Math.min(pageSize - currentCount, elements.length);
      if (!currentPage[date]) {
        currentPage[date] = [];
      }

      currentPage[date].push(...elements.splice(0, take));
      currentCount += take;

      if (currentCount === pageSize) {
        pages.push(currentPage);
        currentPage = {};
        currentCount = 0;
      }
    }
  }

  if (Object.keys(currentPage).length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

const Id = () => {
  const columns = [
    { field: "date", name: "Date" },
    { field: "VehiculeType.name", name: "Engin" },
    { field: "price", name: "Prix U HT" },
    { field: "quantity", name: "Qté(L)" },
  ];

  const router = useRouter();
  const id = router.query.id?.[0];

  const { data, isLoading } = useQuery(
    ["gasoilsortie", id],
    () => axios.get(`/api/v1/gasoilsortie/find/${id}`),
    { enabled: !!id }
  );

  if (!id || isLoading) return <Loading />;

  const result = data?.data?.data;
  if (!result || !Array.isArray(result.GasoilElements)) {
    console.warn("No GasoilElements found");
    return <div>Aucune donnée trouvée</div>;
  }

  // Total quantity
  const totalQuantity = result.GasoilElements.reduce(
    (sum, el) => sum + (parseFloat(el.quantity) || 0),
    0
  );

  // Group by date
  const groupedByDate = result.GasoilElements.reduce((acc, el) => {
    const date = el.date;
    if (!date) {
      console.warn("Element with missing date:", el);
      return acc;
    }

    if (!acc[date]) acc[date] = [];
    acc[date].push(el);
    return acc;
  }, {});

  // Sort date keys
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Build sorted & cleaned grouped object
  const sortedGrouped = {};
  for (const date of sortedDates) {
    sortedGrouped[date] = groupedByDate[date].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  const pages = paginateGasoilElements(sortedGrouped);

  const cleanData = {
    ...result,
    GasoilElements: pages,
    total_quantity: totalQuantity,
  };

  // Optional: clean logging
  // console.log("📄 Paginated pages:", pages.map((p, i) => ({
  //   page: i + 1,
  //   dates: Object.keys(p),
  // })));

  return (
    <>
      <GasoilPdf
        pages={cleanData}
        code="04006"
        columns={columns}
      />
    </>
  );
};

export default Id;
