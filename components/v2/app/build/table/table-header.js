import useURL from "@/components/v2/core/useURL";

const TableHeader = ({ title, value, field }) => {
  const { request, addSort } = useURL((state) => state);
  const sortArr = request.sort;
  const currentSort = sortArr.find((a) => a.name === field);

  const sortDownHandler = () => {
    let newSortArr = [...sortArr];
    const item = newSortArr.find((a) => a.name === field);

    if (!item) {
      newSortArr.push({ name: field, is_desc: false });
    } else if (item.is_desc) {
      newSortArr[newSortArr.indexOf(item)].is_desc = false;
    } else {
      newSortArr = newSortArr.filter((a) => a.name !== field);
    }

    addSort(newSortArr);
  };

  const sortUpHandler = () => {
    let newSortArr = [...sortArr];
    const item = newSortArr.find((a) => a.name === field);

    if (!item) {
      newSortArr.push({ name: field, is_desc: true });
    } else if (!item.is_desc) {
      newSortArr[newSortArr.indexOf(item)].is_desc = true;
    } else {
      newSortArr = newSortArr.filter((a) => a.name !== field);
    }

    addSort(newSortArr);
  };

  return (
    <th className="relative uppercase p-2 w-12 text-center">
      <span className="flex justify-between items-center">
        {title}
        <div>
          <svg
            onClick={sortUpHandler}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className={`${
              currentSort?.name && !!currentSort?.is_desc
                ? "opacity-100 stroke-blue-600"
                : "opacity-20"
            } cursor-pointer size-4 rotate-180`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>

          <svg
            onClick={sortDownHandler}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className={`${
              currentSort?.name && !currentSort?.is_desc
                ? "opacity-100 stroke-blue-600"
                : "opacity-20"
            } cursor-pointer size-4`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="h-1 absolute w-full bottom-0 left-0 flex justify-center items-center">
          <div
            className={`${
              currentSort?.name ? "bg-blue-600 w-full" : "w-0"
            } rounded-full h-full`}
          ></div>
        </div>
      </span>
    </th>
  );
};

export default TableHeader;
