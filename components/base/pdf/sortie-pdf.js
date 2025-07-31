import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import {
  renderDate,
} from "@/components/logic/mini-func";
import StandardPdfHeader from "./standard-pdf-header";
import { styles } from "./pdf-style";


const PreRender = ({ children }) => {
  const [condition, setCondition] = useState(false);
  useEffect(() => {
    setCondition(true);
  }, []);
  if (!condition) {
    return <>loading</>;
  }
  return (
    <PDFViewer style={{width:"100svw", height:"100svh"}} className="w-screen h-screen top-0 left-0 absolute z-[999999]">
      {children}
    </PDFViewer>
  );
};
const currencyFormatter = new Intl.NumberFormat("de-DZ", {
  style: "currency",
  currency: "DZD",
  minimumFractionDigits: 2,
});


const chunkArray = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

const generateHeaderCells = (columns) => {
  return columns.map((column, index) => {
    const styleArray = [styles.tableHeaderCell, styles.bLeft];

    if (index % 2 === 0) {
      styleArray.push(styles.second);
    } else {
      styleArray.push(styles.main);
    }

    if (["quantity", "Unit.name"].includes(column.field)) {
      styleArray.push(styles.small);
    }

    if (column.field === "price") {
      styleArray.push(styles.tableCellRight);
    }
    if (column.name === "Référence") {
      styleArray.push({ width: "20%" });
    }

    return (
      <Text key={column.field} style={styleArray}>
        {column.name}
      </Text>
    );
  });
};

const SortiePdf = ({ data }) => {
  const columns = [
    { field: "Reference.name", name: "Référence" },
    { field: "Article.name", name: "Désignation" },
    { field: "quantity", name: "Qté" },
    { field: "price", name: "Prix U HT" },
  ];

  const headerCells = generateHeaderCells(columns);
  const articlePages = chunkArray(data.ArticleQuiSorts, 12);

  return (
    <PreRender>
      <Document>
        {articlePages.map((articles, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <StandardPdfHeader code={"04006"} date={renderDate(data.date)} />

            <View style={styles.titles}>
              <Text style={styles.title}>
                {"BON DE SORTIE" + ": N°" + ("0000" + data.number).slice(-4)}
              </Text>
            </View>

            <View style={styles.section}>
              <View style={[{ display: "flex", flexDirection: "row" }]}>
                <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                  {"Bénéficiaire: "}
                </Text>
                <Text style={[styles.normalText]}>
                  {data.Beneficiare ? data.Beneficiare?.name : "/"}
                </Text>
              </View>

              {!!data.Vehicule?.name && (
                <View style={[{ display: "flex", flexDirection: "row" }]}>
                  <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                    {"Engin: "}
                  </Text>
                  <Text style={[styles.normalText]}>
                    {data.Vehicule?.name}{" "}
                    {`(${data.Vehicule?.matricule || ""})`}
                  </Text>
                </View>
              )}

              {!!data.Vehicule?.VehiculeClient && (
                <View style={[{ display: "flex", flexDirection: "row" }]}>
                  <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                    {"Client: "}
                  </Text>
                  <Text style={[styles.normalText]}>
                    {data.Vehicule?.VehiculeClient?.name || "/"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.small]}>N°</Text>
                  {headerCells}
                  <Text
                    style={[
                      styles.tableHeaderCell,
                      styles.tableCellRight,
                      styles.second,
                      styles.bLeft,
                    ]}
                  >
                    Montant HT
                  </Text>
                </View>

                {articles.map((item, index) => (
                  <View style={[styles.tableRow, styles.bBottom]} key={index}>
                    <Text style={[styles.tableCell, styles.small]}>
                      {pageIndex * 16 + index + 1}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.second,
                        styles.bLeft,
                        { width: "20%" },
                      ]}
                    >
                      {item.Article?.Ref?.name || ""}
                    </Text>
                    <Text style={[styles.tableCell, styles.main, styles.bLeft]}>
                      {!item.Article.name ? (
                        <>
                          {item.Article?.Tag?.name || ""}
                          {item.Article?.Brand?.name || ""}
                        </>
                      ) : (
                        item.Article.name
                      )}
                    </Text>
                    <Text style={[styles.tableCell, styles.small, styles.bLeft]}>
                      {item.quantity || ""}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.tableCellRight,
                        styles.second,
                        styles.bLeft,
                      ]}
                    >
                      {
                        `${currencyFormatter.format(item.price)}`.replace("ZD", "A")
                    }
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.tableCellRight,
                        styles.second,
                        styles.bLeft,
                      ]}
                    >
                      {
                       `${currencyFormatter.format(item.quantity * item.price)}`
                      
                        .replace("ZD", "A")
                      }
                    </Text>
                  </View>
                ))}

                {pageIndex === articlePages.length - 1 && (
                  <View style={styles.totalRow}>
                    <Text
                      style={[
                        styles.totalLabel,
                        styles.normalText,
                        { width: "83.2%" },
                      ]}
                    >
                      TOTAL HT
                    </Text>
                    <Text
                      style={[
                        styles.totalAmount,
                        styles.tableCellRight,
                        styles.bLeft,
                        styles.normalText,
                      ]}
                    >
                      {
                        currencyFormatter.format(data.total_price)
                        .replace("ZD", "A")
                      }
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.signature}>
              <Text>LE MAGASINIER</Text>
              <Text>LE CONSOMMATEUR</Text>

            </View>
            <View style={[{borderTop: "0.5px solid #000",position:"absolute",bottom:0,padding:"24px",paddingTop:"12px",width:"100%", textAlign:"center",fontSize:11,display:"flex",justifyContent:"space-between"}]}>
                <Text>{pageIndex+1+"/"+articlePages.length}</Text>
              </View>
          </Page>
        ))}
      </Document>
    </PreRender>
  );
};

export default SortiePdf;
