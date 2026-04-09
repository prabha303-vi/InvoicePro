import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { FormData } from "./types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyDetails: {
    flex: 1,
  },
  invoiceDetails: {
    flex: 1,
    textAlign: "right",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#E4E4E4",
    padding: 5,
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  summaryText: {
    width: "50%",
    textAlign: "right",
  },
});

export default function InvoiceDocument({ formData }: { formData: FormData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyDetails}>
            <Text>{formData.sellerName}</Text>
            <Text>{formData.sellerAddress1}</Text>
            <Text>{formData.sellerAddress2}</Text>
            <Text>
              {formData.sellerCity} - {formData.sellerPincode}
            </Text>
            <Text>Phone: {formData.sellerPhone1}</Text>
            <Text>GSTIN: {formData.sellerGSTIN}</Text>
          </View>
          <View style={styles.invoiceDetails}>
            <Text>Invoice No: {formData.invoiceNumber}</Text>
            <Text>Date: {formData.invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>To:</Text>
          <Text>{formData.buyerName}</Text>
          <Text>{formData.buyerAddress1}</Text>
          <Text>{formData.buyerAddress2}</Text>
          <Text>
            {formData.buyerCity} - {formData.buyerPincode}
          </Text>
          <Text>GSTIN: {formData.buyerGSTIN}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Date</Text></View>
            <View style={styles.tableColHeader}><Text>Party Dc No</Text></View>
            <View style={styles.tableColHeader}><Text>Our Dc No</Text></View>
            <View style={styles.tableColHeader}><Text>Fabric</Text></View>
            <View style={styles.tableColHeader}><Text>Colour</Text></View>
            <View style={styles.tableColHeader}><Text>Roll</Text></View>
            <View style={styles.tableColHeader}><Text>Weight</Text></View>
            <View style={styles.tableColHeader}><Text>Rate</Text></View>
            <View style={styles.tableColHeader}><Text>Amount</Text></View>
          </View>
          {formData.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text>{item.itemDate}</Text></View>
              <View style={styles.tableCol}><Text>{item.partyDcNo}</Text></View>
              <View style={styles.tableCol}><Text>{item.ourDcNo}</Text></View>
              <View style={styles.tableCol}><Text>{item.fabric}</Text></View>
              <View style={styles.tableCol}><Text>{item.colour}</Text></View>
              <View style={styles.tableCol}><Text>{item.roll}</Text></View>
              <View style={styles.tableCol}><Text>{item.weight}</Text></View>
              <View style={styles.tableCol}><Text>{item.rate}</Text></View>
              <View style={styles.tableCol}><Text>{item.amount}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryText}>
            <Text>Subtotal: {formData.subtotal}</Text>
            <Text>CGST: {formData.cgstAmount}</Text>
            <Text>SGST: {formData.sgstAmount}</Text>
            <Text>Net Amount: {formData.netAmount}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
