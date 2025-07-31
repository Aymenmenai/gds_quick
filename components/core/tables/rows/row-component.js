import ArticleRow from "./article-row";
import ArticleQSRow from "./articleqs-row";
import EntreeARow from "./entree-a-row";
import EntreeRow from "./entree-row";
import MiniRow from "./mini-row";
import SortieRow from "./sortie-row";

const RowComponent = ({
  thirdFunc,
  id,
  root,
  refetch,
  rows,
  updateFunc = false,
  ...restData
}) => {
  // console.log(rows,'[ROW COMPONENTS]')
  switch (root) {
    case "article":
      return (
        <ArticleRow
          updateFunc={updateFunc}
          refetch={refetch}
          rows={rows?.Articles || rows}
          func={restData.collectIds}
        />
      );
    case "articlequisort":
      return (
        <ArticleQSRow refetch={refetch} rows={rows?.ArticleQuiSorts || rows} />
      );
    case "entree":
      return <EntreeRow refetch={refetch} rows={rows} />;
    case "sortie":
      return <SortieRow refetch={refetch} rows={rows} />;
    case "mini":
      return <MiniRow func={thirdFunc} id={id} rows={rows} />;
    case "article-entree":
      return (
        <EntreeARow
          updateFunc={updateFunc}
          refetch={refetch}
          rows={rows.Articles || rows}
          func={restData.collectIds}
        />
      );
    default:
      return (
        <>
          <ArticleRow rows={rows} func={restData.collectIds} />
        </>
      );
  }
};

export default RowComponent;
