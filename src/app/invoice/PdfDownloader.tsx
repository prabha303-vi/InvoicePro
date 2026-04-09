"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "./InvoiceDocument";
import { FormData } from "./types";

export default function PdfDownloader({ formData }: { formData: FormData }) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument formData={formData} />}
      fileName="invoice.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? "Loading document..." : "Download now!"
      }
    </PDFDownloadLink>
  );
}
