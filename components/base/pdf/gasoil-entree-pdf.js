import React, { Fragment, useEffect } from "react";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";

import { useState } from "react";
import {
  currencyFormatter,
  removeExtraZeros,
  renderDate,
} from "@/components/logic/mini-func";
import StandardPdfHeader from "./standard-pdf-header";
import { styles } from "./pdf-style";

// // PRERENDER
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
  return (
    <>
      <PDFViewer className="w-screen h-screen top-0 left-0 absolute z-[999999]">
        {children}
      </PDFViewer>
    </>
  );
};

// Create styles

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

const GasoilEntreePdf = ({ data, code, columns }) => {
  const headerCells = generateHeaderCells(columns);
  // console.log(data, "Main data");
  return (
    <PreRender>
      <Document>
        <Page size="A4" style={styles.page}>
          <StandardPdfHeader code={code} date={renderDate(data.date)} />


          <View style={styles.titles}>
            <Text style={styles.title}>{`BON D'ENTREE/GS: N°${(
              "0000" + data.number
            ).slice(-4)}`}</Text>

          </View>
          {/* if FOURNISSEUR */}
          <View style={styles.section}>
            <View style={[{ display: "flex", flexDirection: "row" }]}>
              <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                {"Facture: "}
              </Text>
              <Text style={[styles.normalText]}>
                {" "}
                {data.facture ? data.facture : "/"}
              </Text>
            </View>
            <View style={[{ display: "flex", flexDirection: "row" }]}>
              <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                {"Fournisseur: "}
              </Text>
              <Text style={[styles.normalText]}>
                {data.Fournisseur ? data.Fournisseur?.name : "-"}
              </Text>
            </View>
          </View>

          <>
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.small]}>
                    {"N°"}
                  </Text>
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
                {/* Table Rows */}

                <>
                  <View style={[styles.tableRow, styles.bBottom]}>
                    <Text style={[styles.tableCell, styles.small,]}>
                      {1}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.second,
                        styles.bLeft,
                        { width: "20%" }
                      ]}
                    >
                      {`GAS ${renderDate(data.date).split("/")[2]}`}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.main,
                        styles.bLeft,
                        { padding: "1px 7px" },
                      ]}
                    >
                      {"GASOIL"}
                    </Text>
                    <Text
                      style={[styles.tableCell, styles.small, styles.bLeft]}
                    >
                      {data.quantity}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.tableCellRight,
                        styles.second,
                        styles.bLeft,
                      ]}
                    >
                      {removeExtraZeros(
                        currencyFormatter.format(data.price)
                      )
                        .replace("ZD", "A")
                        .trim()}
                    </Text>

                    <Text
                      style={[
                        styles.tableCell,
                        styles.tableCellRight,
                        styles.second,
                        ,
                        styles.bLeft,
                      ]}
                    >
                      {removeExtraZeros(
                        currencyFormatter.format(
                          data.quantity * data.price
                        )
                      )
                        .replace("ZD", "A")
                        .trim()}
                    </Text>
                  </View>
                </>

                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, styles.normalText, { width: '83.15%' }]}>
                    TOTAL HT{" "}
                  </Text>
                  <Text
                    style={[
                      styles.totalAmount,
                      styles.tableCellRight,
                      styles.bLeft,
                      styles.normalText,
                    ]}
                  >
                    {removeExtraZeros(
                      currencyFormatter.format(data.quantity * data.price)
                    )
                      .replace("ZD", "A")
                      .trim()}
                  </Text>
                </View>
                {/* Total Row */}
              </View>
            </View>
          </>
          <View style={styles.signature}>
            <Text>LA GDS</Text>
          </View>
        </Page>
      </Document>
    </PreRender>
  );
};

export default GasoilEntreePdf;
