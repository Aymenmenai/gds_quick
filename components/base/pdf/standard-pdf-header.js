import { Text, View } from "@react-pdf/renderer";
import React from "react";
import PdfLogo from "./pdf-logo";
import { styles } from "./pdf-style";

export default function StandardPdfHeader({ code, date }) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.text}>{`EPE - RAIL LOGISTIC SPA`}</Text>
          <Text style={[styles.normalText]}>{`Filiale SNTF`}</Text>
          <Text style={[styles.normalText]}>
            {"Direction des Achats-approvisionnements"}
          </Text>
          <Text style={[styles.normalText]}>
            {"Departement Gestion des Stocks"}
          </Text>
        </View>
        <PdfLogo />
      </View>
      <View style={[styles.extraInfo]}>
        <Text >{`ROUIBA, LE ${date}`}</Text>
        <Text style={[styles.smallText]}>{`CODE DOC : ${code}`}</Text>
      </View>
    </>
  );
}
