import { Font, StyleSheet } from "@react-pdf/renderer";
// import path from "../../../public"

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto-Thin.ttf",
      fontWeight: 100, // Thin
    },
    {
      src: "/fonts/Roboto-ThinItalic.ttf",
      fontWeight: 100,
      fontStyle: "italic", // Thin Italic
    },
    {
      src: "/fonts/Roboto-Light.ttf",
      fontWeight: 300, // Light
    },
    {
      src: "/fonts/Roboto-LightItalic.ttf",
      fontWeight: 300,
      fontStyle: "italic", // Light Italic
    },
    {
      src: "/fonts/Roboto-Regular.ttf",
      fontWeight: 400, // Regular
    },
    {
      src: "/fonts/Roboto-Italic.ttf",
      fontWeight: 400,
      fontStyle: "italic", // Regular Italic
    },
    {
      src: "/fonts/Roboto-Medium.ttf",
      fontWeight: 500, // Medium
    },
    {
      src: "/fonts/Roboto-MediumItalic.ttf",
      fontWeight: 500,
      fontStyle: "italic", // Medium Italic
    },
    {
      src: "/fonts/Roboto-Bold.ttf",
      fontWeight: 700, // Bold
    },
    {
      src: "/fonts/Roboto-BoldItalic.ttf",
      fontWeight: 700,
      fontStyle: "italic", // Bold Italic
    },
    {
      src: "/fonts/Roboto-Black.ttf",
      fontWeight: 900, // Black
    },
    {
      src: "/fonts/Roboto-BlackItalic.ttf",
      fontWeight: 900,
      fontStyle: "italic", // Black Italic
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "20px 30px",
    borderBottom: "0.5px solid #000",
  },
  info: {
    fontWeight: 900,
    fontSize: 10,
    color: "#000",
    display: "flex",
    flexDirection: "column",
  },
  text: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Roboto",
    fontWeight: "extrabold",
  },
  normalText: {
    fontSize: 10,
    fontWeight: 400,
  },
  extraInfo: {
    // backgroundColor: "red",
    display: "flex",
    textAlign: "right",
    // flexDirection: "column-reverse",
    // justifyContent:"start",
    // alignItems: "start",
    // gap: 0,
    padding: "10px 30px",
    fontSize: 9,
  },
  smallText: {
    fontSize: 7,
    fontWeight: 900,
  },
  titles: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px",
  },
  title: {
    fontSize: 15,
    fontWeight: 900,
    textDecoration: "underline",
  },
  section: {
    fontSize: 10,
    margin: 10,
    padding: 20,
    fontWeight: 900,
  },
  tableContainer: {
    padding: 1.2, // Creates space around the table
    backgroundColor: "#000", // Ring color
    borderRadius: 5, // Rounded corners for the ring
    width: "90%", // Same as table width
    margin: "0 auto",
  },
  table: {
    width: "100%", // Set table width to fill the container
    margin: "auto",
    fontSize: 9,
    borderRadius: 4, // Inner table's own rounded corners
    overflow: "hidden",
    backgroundColor: "#ffffff", // Background color of the table itself
  },
  tableHeader: {
    flexDirection: "row",
    // backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #000",
    // paddingVertical: 5,
  },
  tableHeaderCell: {
    // flex: 1,
    textAlign: "center",
    fontWeight: 900,
    paddingVertical: 5,
    color: "#000",
    fontFamily: "Roboto",
  },
  tableRow: {
    flexDirection: "row",
    // paddingVertical: 5,
  },
  bLeft: {
    borderLeft: "1px solid #000",
    
  },
 bRight: {
    borderRight: "1px solid #000",
    // backgroundColor: "pink",
    // display: "flex",
    // justifyContent: "center", // Centers horizontally
    // alignItems: "center", // Centers vertically
    // textAlign: "center", // Ensures text alignment inside the cell
    // height: "100%", // Makes sure the height is always respected
}
,
  bBottom: {
    borderBottom: "1px solid #000",
  },
  tableCell: {
    // flex: 1,
    textAlign: "center",
    paddingVertical: 5,
    fontFamily: "Roboto",
    fontSize: 9,
   
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  totalRow: {
    flexDirection: "row",
    // paddingVertical: 8,
    // borderTop: "1px solid #bfbfbf",
    fontWeight: "bold",
    // backgroundColor: "#f9f9f9",
  },

  // SPECIAL MODIFICAFIONS ========================
  small: {
    // backgroundColor: "red",
    width: "25px",
  },
  main: {
    // backgroundColor: "orange",
    width: "37%",
  },
  second: {
    // backgroundColor: "yellow",
    width: "25%",
  },
  // SPECIAL MODIFICAFIONS ========================

  totalLabel: {
    // flex: 1,
    width: "88%",

    textAlign: "center",
    fontWeight: 900,
    paddingVertical: 5,

    // backgroundColor: "red",
  },
  totalAmount: {
    textAlign: "right",
    paddingRight: 8,
    fontWeight: 900,
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',
    paddingVertical: 5,

    // height:'100%',
    // width: "25%",
    // backgroundColor: "yellow",
  },
  signature: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 50,
    fontSize: 10,
    textDecoration: "underline",
    fontWeight: 900,
  },
});
