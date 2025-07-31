import React, { useState, useEffect, Fragment } from "react";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import {
  currencyFormatter,
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
  return (
    <>
      <PDFViewer style={{width:"100svw", height:"100svh"}}>
        {children}
      </PDFViewer>
    </>
  );
};

// Create styles

const generateHeaderCells = (columns) => {
  return columns.map((column, index) => {
    const styleArray = [styles.tableHeaderCell, styles.bRight];

    if (index % 2 === 0) {
      styleArray.push(styles.second);
    } else {
      styleArray.push(styles.main);
    }

    if (["quantity", "Unit.name"].includes(column.field)) {
      styleArray.push(styles.small);
      styleArray.push({width:"6%"});
    }

    if (column.field === "price") {
      styleArray.push(styles.tableCellRight);
    }

    return (
      <Text key={column.field} style={styleArray}>
        {column.name}
      </Text>
    );
  });
};
const GasoilPdf = ({ pages, code, columns }) => {
  // console.log(data, "Main data");
  const headerCells = generateHeaderCells(columns);



  return (
    <PreRender>
      <Document>
        {pages.GasoilElements.map((data,index)=>(
           <Page key={index} size="A4" style={styles.page}>
          <StandardPdfHeader code={code} date={renderDate(pages.date)} />

          <View style={styles.titles}>
            <Text style={styles.title}>
              {"BON DE SORTIE" + ": N°" + ("0000" + pages.number).slice(-4)}
            </Text>
          </View>
          {/* if FOURNISSEUR */}
          <View style={styles.section}>
            <View style={[{ display: "flex", flexDirection: "row" }]}>
              <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                {"Bénéficiaire: "}
              </Text>
              <Text style={[styles.normalText]}>
                {pages.Beneficiare?.name ? pages.Beneficiare?.name : "/"}
              </Text>
            </View>

             <View style={[{ display: "flex", flexDirection: "row" }]}>
              <Text style={[styles.normalText, { fontWeight: "bold" }]}>
                {"Produit: "}
              </Text>
              <Text style={[styles.normalText]}>
                {"Gasoil"}
              </Text>
            </View>


          </View>
           
          <>
            <View style={[styles.tableContainer]}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  {headerCells}
                  <Text
                    style={[
                      styles.tableHeaderCell,
                      styles.tableCellRight,
                      styles.second,
                    ]}
                  >
                    Montant HT
                  </Text>
                </View>
                {/* Table Rows */}
                {Object.keys(data).map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.second,
                        styles.bRight,
                        styles.bBottom,
                      ]}
                    >
                      {renderDate(item)}
                    </Text>

                    <View style={[{ width: "75%" }]}>
                      {data[item].map((el, id) => {
                        return (
                          <View style={styles.tableRow} key={id}>
                            <Text
                              style={[
                                styles.tableCell,
                                styles.main,
                                styles.bRight,
                                styles.bBottom,
                                { width: "49.3%",height:"100%",backgroundColor:"white", padding: "0px 3px",display:"flex",alignItems:"center",},
                              ]}
                            >
                              {el.Vehicule && (
                                <>
                                  {el?.Vehicule?.name}
                                  {`(${el?.Vehicule.matricule})`}
                                </>
                              )}
                            </Text>
                           
                            <Text
                              style={[
                                styles.tableCell,
                                styles.tableCellRight,
                                styles.second,
                                styles.bRight,
                                styles.bBottom,
                              ]}
                            >
                              {
                                currencyFormatter.format(el.price)
                                .replace("ZD", "A")
                                .trim()}
                            </Text>


                            <Text
                              style={[
                                styles.tableCell,
                                styles.small,
                                styles.bRight,
                                styles.bBottom,
                                {width:"8%"}
                              ]}
                            >
                              {el.quantity}
                            </Text>


                            <Text
                              style={[
                                styles.tableCell,
                                styles.tableCellRight,
                                styles.second,
                                styles.bBottom,
                              ]}
                            >
                              {
                                currencyFormatter.format(el.quantity * el.price) .replace("ZD", "A")
                                .trim()
                              }
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
                {/* Total Row */}
                {index === pages.GasoilElements.length-1 &&
                
                     <View style={styles.totalRow}>
                  <Text
                    style={[
                      styles.totalwithQ,
                      styles.totalLabel,
                      styles.normalText,
                      { width: "77.9%" },
                    ]}
                  >
                    TOTAL HT{" "}
                  </Text>
                  {/* <Text style={[styles.tableCell, styles.small, styles.bLeft]}>
                    {Object.values(data)
                      .flatMap((dateArray) =>
                        dateArray.map((obj) => obj.quantity)
                      )
                      .reduce((acc, quantity) => acc + quantity, 0)}
                  </Text> */}
                   <Text
                              style={[
                                styles.tableCell,
                                styles.small,
                                styles.bLeft,
                                // styles.bBottom,
                                {width:"6%"}
                              ]}
                            >
                              {pages.total_quantity }
                            </Text>

                  <Text
                    style={[
                      styles.totalAmount,
                      styles.tableCellRight,
                      styles.bLeft,
                    ]}
                  >
                    {currencyFormatter.format(
                        pages.total_price
                  ).replace("ZD", "A")}


                   
                  </Text>
                </View>
                
                 } 
           
              </View>
            </View>
          </>
          <View style={styles.signature}>
            <Text>LA GDS</Text>
            <Text>LE DEMANDEUR</Text>
          </View>

          <View style={[{borderTop: "0.5px solid #000",position:"absolute",bottom:0,padding:"24px",paddingTop:"12px",width:"100%", textAlign:"center",fontSize:11,display:"flex",justifyContent:"space-between"}]}>
            <Text>{index+1+"/"+pages.GasoilElements.length}</Text>
          </View>

        </Page>
        


        ))}
       
      </Document>
    </PreRender>
  );
};

export default GasoilPdf;
// // PRERENDER