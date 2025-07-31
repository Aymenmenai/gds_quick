import React, { Fragment, useEffect } from "react";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";

import { useState } from "react";
import {
  renderDate,
} from "@/components/logic/mini-func";
import StandardPdfHeader from "./standard-pdf-header";
import { styles } from "./pdf-style";

const PreRender = ({ children }) => {
  const [condition, setCondition] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setCondition(true);
    }, 1000);
  }, []);
  if (!condition) {
    return <>loading</>;
  }
  return <PDFViewer style={{ width: "100svw", height: "100svh" }} className="w-screen h-screen top-0 left-0 absolute z-[999999]">{children}</PDFViewer>;
};

const currencyFormatter = new Intl.NumberFormat("de-DZ", {
  style: "currency",
  currency: "DZD",
  minimumFractionDigits: 2,
});

const generateHeaderCells = (columns) => {
  return columns.map((column, index) => {
    const styleArray = [styles.tableHeaderCell, styles.bLeft];
    if (index % 2 === 0) styleArray.push(styles.second);
    else styleArray.push(styles.main);
    if (["quantity", "Unit.name"].includes(column.field)) styleArray.push(styles.small);
    if (column.field === "price") styleArray.push(styles.tableCellRight);
    if (column.name === "Référence") styleArray.push({ width: "20%" });
    return <Text key={column.field} style={styleArray}>{column.name}</Text>;
  });
};

const chunkArray = (arr, size) => arr.length ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [];

const EntreePdf = ({ data, code, columns }) => {
  const headerCells = generateHeaderCells(columns);
  const paginatedArticles = chunkArray(data.Articles, 12);
  return (
    <PreRender>
      <Document>
        {paginatedArticles.map((articles, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <StandardPdfHeader code={code} date={renderDate(data.date)} />
            <View style={styles.titles}>
              <Text style={styles.title}>{`BON D'ENTREE: N°${("0000" + data.number).slice(-4)}`}</Text>
            </View>
            <View style={styles.section}>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.normalText, { fontWeight: "bold" }]}>Facture: </Text>
                <Text style={styles.normalText}>{data.facture || "/"}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.normalText, { fontWeight: "bold" }]}>Bon de livraison: </Text>
                <Text style={styles.normalText}>{data.bon_de_livraison || "/"}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.normalText, { fontWeight: "bold" }]}>Fournisseur: </Text>
                <Text style={styles.normalText}>{data.Fournisseur?.name || "-"}</Text>
              </View>
            </View>
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.small]}>N°</Text>
                  {headerCells}
                  <Text style={[styles.tableHeaderCell, styles.tableCellRight, styles.second, styles.bLeft]}>Montant HT</Text>
                </View>
                {articles.map((item, index) => (
                  <Fragment key={index}>
                    <View style={[styles.tableRow, styles.bBottom]}>
                      <Text style={[styles.tableCell, styles.small]}>{index + 1}</Text>
                      <Text style={[styles.tableCell, styles.second, styles.bLeft, { width: "20%" }]}>{item?.Ref?.name}</Text>
                      <Text style={[styles.tableCell, styles.main, styles.bLeft, { padding: "1px 7px" }]}>
                        {item.name || `${item?.Tag?.name} ${item?.Brand?.name}`}
                      </Text>
                      <Text style={[styles.tableCell, styles.small, styles.bLeft]}>{item.initial_quantity}</Text>
                      <Text style={[styles.tableCell, styles.small, styles.bLeft]}>{item?.Unit?.name || "U"}</Text>
                      <Text style={[styles.tableCell, styles.tableCellRight, styles.second, styles.bLeft]}>
                        {currencyFormatter.format(item.price).replace("ZD", "A")}
                      </Text>
                      <Text style={[styles.tableCell, styles.tableCellRight, styles.second, styles.bLeft]}>
                        {currencyFormatter.format(item.initial_quantity * item.price).replace("ZD", "A")}
                      </Text>
                    </View>
                  </Fragment>
                ))}
                {pageIndex === paginatedArticles.length - 1 && (
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, styles.normalText, { width: "85.515%" }]}>TOTAL HT</Text>
                    <Text style={[styles.totalAmount, styles.tableCellRight, styles.bLeft, styles.normalText]}>
                      {currencyFormatter.format(data.total_price).replace("ZD", "A")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.signature}>
              <Text></Text>
              <Text>LE MAGASINIER</Text>
            </View>
            <View style={[{borderTop: "0.5px solid #000",position:"absolute",bottom:0,padding:"24px",paddingTop:"12px",width:"100%", textAlign:"center",fontSize:11,display:"flex",justifyContent:"space-between"}]}>
                <Text>{pageIndex+1+"/"+paginatedArticles.length}</Text>
              </View>
          </Page>
        ))}
      </Document>
    </PreRender>
  );
};

export default EntreePdf;