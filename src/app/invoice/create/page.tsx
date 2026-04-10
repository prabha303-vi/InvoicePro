"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEye, FiPrinter, FiPlus, FiTrash2, FiDownload, FiEdit, FiFileText, FiHash, FiUsers, FiBriefcase, FiCreditCard, FiShoppingCart, FiCalendar } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface InvoiceItem {
  id: string;
  date: string;
  partyDcNo: string;
  ourDcNo: string;
  fabric: string;
  colour: string;
  roll: string;
  weight: string;
  rate: string;
  amount: string;
}

function numberToWordsINR(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertHundreds(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  }

  function convert(n: number): string {
    if (n === 0) return "";
    let str = "";
    if (n >= 10000000) {
      str += convert(Math.floor(n / 10000000)) + " Crore ";
      n %= 10000000;
    }
    if (n >= 100000) {
      str += convert(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }
    if (n >= 1000) {
      str += convert(Math.floor(n / 1000)) + " Thousand ";
      n %= 1000;
    }
    if (n > 0) {
      str += convertHundreds(n);
    }
    return str.trim();
  }

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let word = "RUPEES " + convert(rupees).toUpperCase();
  if (paise > 0) {
    word += " AND " + convert(paise).toUpperCase() + " PAISE";
  }
  word += " ONLY";
  return word;
}

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "11px 14px", border: "2px solid #e2e8f0",
          borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
          background: "#f8fafc", transition: "all 0.2s ease", color: "#1e293b",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)"; e.target.style.background = "#fff"; }}
        onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
      />
    </div>
  );
}

function parseDateStr(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10), m = parseInt(parts[1], 10) - 1, y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return null;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function DatePickerField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <DatePicker
          selected={parseDateStr(value)}
          onChange={(date: Date | null) => onChange(formatDate(date))}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY"
          className="custom-datepicker-input"
          calendarClassName="custom-datepicker-calendar"
          showPopperArrow={false}
          popperPlacement="bottom-start"
          todayButton="Today"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          customInput={
            <input
              style={{
                width: "100%", padding: "11px 14px", paddingRight: 40, border: "2px solid #e2e8f0",
                borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
                background: "#f8fafc", transition: "all 0.2s ease", color: "#1e293b", cursor: "pointer",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
            />
          }
        />
        <FiCalendar style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "POWER PLUS BLEACHING",
    companyAddress: "S.F NO .8/6,8/7 KARNAYAN THOTTAM, POOMALUR (VILLAGE)",
    companyAddress2: "PALLADAM (TK), TIRUPPUR 641663",
    companyCell: "98421 31190, 9751331190",
    companyGSTIN: "33ADEFS0989B1Z7",
    companyPhone1: "98422 34582",
    companyPhone2: "73735 92138",
    invoiceNumber: "771/25-26",
    invoiceDate: formatDate(new Date()),
    serviceCode: "998821",
    stateCode: "Tamilnadu & 33",
    customerName: "",
    customerAddress: "",
    customerAddress2: "TIRUPUR-641602",
    customerGSTIN: "",
    bankName: "CANARA BANK",
    bankBranch: "KARUMATHAMPATTI, COIMBATORE",
    bankAcNo: "3437261000069",
    bankIFSC: "CNRB0003437",
    cgstRate: "2.50",
    sgstRate: "2.50",
    items: [
      // {
      //   id: "1", date: formatDate(new Date()), partyDcNo: "106", ourDcNo: "4093/25-26",
      //   fabric: "S/J", colour: "Grey", roll: "422", weight: "8447.900", rate: "11.00", amount: "92926.90"
      // },
      // {
      //   id: "2", date: formatDate(new Date()), partyDcNo: "106.", ourDcNo: "4094/25-26",
      //   fabric: "L/Rib", colour: "Grey", roll: "22", weight: "455.500", rate: "45.00", amount: "20497.50"
      // }
    ] as InvoiceItem[]
  });

  const calculateTotals = () => {
    const totalWeight = formData.items.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0);
    const totalRoll = formData.items.reduce((s, i) => s + (parseInt(i.roll) || 0), 0);
    const subtotal = formData.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const cgstPct = parseFloat(formData.cgstRate) || 0;
    const sgstPct = parseFloat(formData.sgstRate) || 0;
    const cgst = subtotal * (cgstPct / 100);
    const sgst = subtotal * (sgstPct / 100);
    const netAmount = subtotal + cgst + sgst;
    return {
      totalWeight: totalWeight.toFixed(3),
      totalRoll: totalRoll.toString(),
      subtotal: subtotal.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      netAmount: netAmount.toFixed(2)
    };
  };

  const addNewItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now().toString(), date: formatDate(new Date()), partyDcNo: "", ourDcNo: "",
        fabric: "", colour: "", roll: "", weight: "", rate: "", amount: ""
      }]
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "weight" || field === "rate") {
          const w = parseFloat(field === "weight" ? value : updated.weight) || 0;
          const r = parseFloat(field === "rate" ? value : updated.rate) || 0;
          updated.amount = (w * r).toFixed(2);
        }
        return updated;
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      const now = new Date();
      const ts = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        now.getDate().toString().padStart(2, "0") + "_" +
        now.getHours().toString().padStart(2, "0") +
        now.getMinutes().toString().padStart(2, "0") +
        now.getSeconds().toString().padStart(2, "0");
      pdf.save("Invoice_" + formData.invoiceNumber.replace(/\//g, "-") + "_" + ts + ".pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const totals = calculateTotals();

  /* ═══════════════ PREVIEW ═══════════════ */
  if (showPreview) {
    const B = "1px solid #4b5563";
    const cellPad = "5px 8px";

    return (
      <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "0" }}>
        {/* Toolbar */}
        <div className="print:hidden" style={{
          background: "linear-gradient(135deg, #1e293b, #334155)",
          padding: "16px 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ maxWidth: 850, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setShowPreview(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 20px",
                  border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
                  background: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 14,
                  color: "#e2e8f0", fontWeight: 500, transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              >
                <FiEdit size={15} /> Edit
              </button>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", background: "rgba(59,130,246,0.15)",
                borderRadius: 8, border: "1px solid rgba(59,130,246,0.2)",
              }}>
                <FiFileText style={{ color: "#93c5fd", fontSize: 14 }} />
                <span style={{ fontSize: 13, color: "#93c5fd", fontWeight: 600 }}>Invoice #{formData.invoiceNumber}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => window.print()}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 20px",
                  border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
                  background: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 14,
                  color: "#e2e8f0", fontWeight: 500, transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              >
                <FiPrinter size={15} /> Print
              </button>
              <button onClick={downloadPDF} disabled={isGenerating}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 22px",
                  borderRadius: 10, border: "none", cursor: isGenerating ? "not-allowed" : "pointer",
                  fontSize: 14, fontWeight: 600, color: "#fff",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
                  opacity: isGenerating ? 0.6 : 1, transition: "all 0.2s",
                }}>
                <FiDownload size={15} /> {isGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 0 40px" }}>

        {/* ── INVOICE DOCUMENT ── */}
        <div ref={invoiceRef} style={{
          width: 794, margin: "0 auto", background: "#fff",
          padding: "24px 32px 20px",
          fontFamily: "Arial, Helvetica, sans-serif", color: "#000",
          fontSize: 12, lineHeight: 1.45,
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
          borderRadius: 4,
        }}>

          {/* TITLE */}
          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, borderBottom: "2px solid #4b5563", paddingBottom: 6, marginBottom: 0 }}>
            TAX INVOICE
          </div>

          {/* COMPANY + META */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: B, borderRight: B, borderBottom: B }}>
            <tbody>
              <tr>
                <td style={{ width: "58%", padding: "8px 10px", verticalAlign: "top", borderRight: B }}>
                  <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 2 }}>{formData.companyName}</div>
                  <div>{formData.companyAddress}</div>
                  <div>{formData.companyAddress2}</div>
                  <div>CELL &nbsp;: {formData.companyCell}</div>
                  <div style={{ fontWeight: "bold" }}>GSTIN : {formData.companyGSTIN}</div>
                </td>
                <td style={{ width: "42%", padding: "8px 10px", verticalAlign: "top" }}>
                  <table style={{ width: "100%", fontSize: 12 }}>
                    <tbody>
                      <tr><td>PHONE</td><td style={{ textAlign: "right" }}>: {formData.companyPhone1}</td></tr>
                      <tr><td></td><td style={{ textAlign: "right" }}>: {formData.companyPhone2}</td></tr>
                    </tbody>
                  </table>
                  <div style={{ borderTop: B, marginTop: 10, paddingTop: 8 }}>
                    <table style={{ width: "100%", fontSize: 12 }}>
                      <tbody>
                        <tr><td>Invoice No</td><td style={{ textAlign: "right" }}>: {formData.invoiceNumber}</td></tr>
                        <tr><td>Date</td><td style={{ textAlign: "right" }}>: {formData.invoiceDate}</td></tr>
                        <tr><td>Service code</td><td style={{ textAlign: "right" }}>: {formData.serviceCode}</td></tr>
                        <tr><td>State &amp; code</td><td style={{ textAlign: "right" }}>: {formData.stateCode}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* CUSTOMER */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: B, borderRight: B, borderBottom: B }}>
            <tbody>
              <tr>
                <td style={{ padding: "6px 10px" }}>
                  <span>To&nbsp;&nbsp;&nbsp;</span>
                  <span style={{ fontWeight: "bold" }}>{formData.customerName}</span>
                  <div style={{ paddingLeft: 32 }}>{formData.customerAddress}</div>
                  <div style={{ paddingLeft: 32 }}>{formData.customerAddress2}</div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 10px 6px" }}>
                  <span style={{ fontWeight: "bold" }}>GSTIN :{formData.customerGSTIN}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ITEMS TABLE — vertical lines only between columns, horizontal only on header/footer */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: B, borderRight: B, borderTop: B, borderBottom: B, fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: B }}>
                <th style={{ borderLeft: B, borderRight: B, padding: cellPad, width: 28, textAlign: "center" }}>Sl<br/>No</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "left" }}>Date</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "left" }}>Party Dc<br/>No.</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "left" }}>OurDc<br/>No.</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "left" }}>Fabric</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "left" }}>Colour</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>Roll</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>Weight</th>
                <th style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>Rate</th>
                <th style={{ padding: cellPad, textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => (
                <tr key={item.id}>
                  <td style={{ borderLeft: B, borderRight: B, padding: cellPad, textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ borderRight: B, padding: cellPad }}>{item.date}</td>
                  <td style={{ borderRight: B, padding: cellPad }}>{item.partyDcNo}</td>
                  <td style={{ borderRight: B, padding: cellPad }}>{item.ourDcNo}</td>
                  <td style={{ borderRight: B, padding: cellPad }}>{item.fabric}</td>
                  <td style={{ borderRight: B, padding: cellPad }}>{item.colour}</td>
                  <td style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>{item.roll}</td>
                  <td style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>{item.weight}</td>
                  <td style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>{item.rate}</td>
                  <td style={{ padding: cellPad, textAlign: "right" }}>{item.amount}</td>
                </tr>
              ))}
              {/* Empty rows */}
              {Array.from({ length: Math.max(0, 10 - formData.items.length) }).map((_, i) => (
                <tr key={"e" + i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j} style={{ borderRight: j < 9 ? B : "none", padding: cellPad, height: 18 }}>&nbsp;</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: "bold", borderTop: B }}>
                <td colSpan={6} style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>Total</td>
                <td style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>{totals.totalRoll}</td>
                <td style={{ borderRight: B, padding: cellPad, textAlign: "right" }}>{totals.totalWeight}</td>
                <td style={{ borderRight: B, padding: cellPad }}></td>
                <td style={{ padding: cellPad, textAlign: "right" }}>{totals.subtotal}</td>
              </tr>
            </tfoot>
          </table>

          {/* CGST / SGST rows — no vertical lines, right-aligned like paper */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: B, borderRight: B, fontSize: 12 }}>
            <tbody>
              <tr style={{ borderBottom: B }}>
                <td style={{ padding: "4px 10px", textAlign: "right" }}>
                  <span>CGST @ &nbsp;&nbsp;{formData.cgstRate}%</span>
                  <span style={{ fontWeight: "bold", display: "inline-block", minWidth: 90, textAlign: "right", marginLeft: 20 }}>{totals.cgst}</span>
                </td>
              </tr>
              <tr style={{ borderBottom: B }}>
                <td style={{ padding: "4px 10px", textAlign: "right" }}>
                  <span>SGST @ &nbsp;&nbsp;{formData.sgstRate}%</span>
                  <span style={{ fontWeight: "bold", display: "inline-block", minWidth: 90, textAlign: "right", marginLeft: 20 }}>{totals.sgst}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* RUPEES IN WORDS + NET AMOUNT */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: B, borderRight: B, borderBottom: B, fontSize: 12 }}>
            <tbody>
              <tr>
                <td style={{ width: "60%", padding: "8px 10px", borderRight: B, verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", marginBottom: 2 }}>Rupees in Words :</div>
                  <div style={{ fontSize: 11 }}>{numberToWordsINR(parseFloat(totals.netAmount))}</div>
                </td>
                <td style={{ padding: "8px 10px", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", fontSize: 13 }}>Net Amount</span>
                    <span style={{ fontWeight: "bold", fontSize: 14 }}>{totals.netAmount}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* BANK DETAILS + SIGNATORY + RECEIVED BY */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: B, borderRight: B, borderBottom: B, fontSize: 12 }}>
            <tbody>
              {/* Row 1: Bank Details | Certified + For Company */}
              <tr>
                <td style={{ width: "50%", padding: "8px 10px", verticalAlign: "top", borderRight: B }}>
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>Bank Details :</div>
                  <table style={{ fontSize: 12 }}>
                    <tbody>
                      <tr><td style={{ paddingRight: 16, fontWeight: "bold", paddingBottom: 2 }}>Bank</td><td style={{ paddingBottom: 2 }}>: {formData.bankName}</td></tr>
                      <tr><td style={{ paddingRight: 16, fontWeight: "bold", paddingBottom: 2 }}>Branch</td><td style={{ paddingBottom: 2 }}>: {formData.bankBranch}</td></tr>
                      <tr><td style={{ paddingRight: 16, fontWeight: "bold", paddingBottom: 2 }}>Ac/No</td><td style={{ paddingBottom: 2 }}>: {formData.bankAcNo}</td></tr>
                      <tr><td style={{ paddingRight: 16, fontWeight: "bold", paddingBottom: 2 }}>IFSC Code</td><td style={{ paddingBottom: 2 }}>: {formData.bankIFSC}</td></tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ width: "50%", padding: "8px 10px", verticalAlign: "top", textAlign: "center" }}>
                  <div style={{ fontSize: 11 }}>Certified that Particulars given above are true and correct</div>
                  <div style={{ fontWeight: "bold", marginTop: 6, fontSize: 12 }}>For {formData.companyName}</div>
                </td>
              </tr>
              {/* Row 2: Received by | Authorized Signatory */}
              <tr style={{ borderTop: B }}>
                <td style={{ padding: "14px 10px", verticalAlign: "bottom", borderRight: B, textAlign: "left" }}>
                  <span>Received by</span>
                </td>
                <td style={{ padding: "14px 10px", verticalAlign: "bottom", textAlign: "center" }}>
                  <span>Authorized Signatory</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    );
  }

  /* ═══════════════ FORM ═══════════════ */
  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #334155)",
        padding: "20px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.back()}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
              background: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 14,
              fontWeight: 500, color: "#e2e8f0",
            }}>
            <FiArrowLeft /> Back
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: -0.3 }}>Create Invoice</h1>
            <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 14 }}>Fill in the details to generate a tax invoice</p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", background: "rgba(59,130,246,0.15)",
            borderRadius: 8, border: "1px solid rgba(59,130,246,0.2)",
          }}>
            <FiHash style={{ color: "#93c5fd", fontSize: 14 }} />
            <span style={{ fontSize: 13, color: "#93c5fd", fontWeight: 600 }}>{formData.invoiceNumber}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 40px" }}>
        <form onSubmit={handleSubmit}>
          {/* Company */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 28px", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiBriefcase style={{ color: "#2563eb", fontSize: 18 }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Company Information</h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
              <FormField label="Company Name" value={formData.companyName} onChange={(v) => setFormData(p => ({ ...p, companyName: v }))} />
              <FormField label="GSTIN" value={formData.companyGSTIN} onChange={(v) => setFormData(p => ({ ...p, companyGSTIN: v }))} />
              <FormField label="Address Line 1" value={formData.companyAddress} onChange={(v) => setFormData(p => ({ ...p, companyAddress: v }))} />
              <FormField label="Address Line 2" value={formData.companyAddress2} onChange={(v) => setFormData(p => ({ ...p, companyAddress2: v }))} />
              <FormField label="Phone 1" value={formData.companyPhone1} onChange={(v) => setFormData(p => ({ ...p, companyPhone1: v }))} />
              <FormField label="Phone 2" value={formData.companyPhone2} onChange={(v) => setFormData(p => ({ ...p, companyPhone2: v }))} />
            </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", position: "relative", zIndex: 10 }}>
            <div style={{ padding: "18px 28px", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12, borderRadius: "16px 16px 0 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiHash style={{ color: "#7c3aed", fontSize: 18 }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Invoice Details</h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "18px 24px" }}>
              <FormField label="Invoice Number" value={formData.invoiceNumber} onChange={(v) => setFormData(p => ({ ...p, invoiceNumber: v }))} />
              <DatePickerField label="Date" value={formData.invoiceDate} onChange={(v) => setFormData(p => ({ ...p, invoiceDate: v }))} />
              <FormField label="Service Code" value={formData.serviceCode} onChange={(v) => setFormData(p => ({ ...p, serviceCode: v }))} />
              <FormField label="State & Code" value={formData.stateCode} onChange={(v) => setFormData(p => ({ ...p, stateCode: v }))} />
            </div>
            </div>
          </div>

          {/* Customer */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 28px", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiUsers style={{ color: "#059669", fontSize: 18 }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Customer Information</h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
              <FormField label="Customer Name" value={formData.customerName} onChange={(v) => setFormData(p => ({ ...p, customerName: v }))} />
              <FormField label="GSTIN" value={formData.customerGSTIN} onChange={(v) => setFormData(p => ({ ...p, customerGSTIN: v }))} />
              <FormField label="Address Line 1" value={formData.customerAddress} onChange={(v) => setFormData(p => ({ ...p, customerAddress: v }))} />
              <FormField label="Address Line 2" value={formData.customerAddress2} onChange={(v) => setFormData(p => ({ ...p, customerAddress2: v }))} />
            </div>
            </div>
          </div>

          {/* Bank */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 28px", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiCreditCard style={{ color: "#d97706", fontSize: 18 }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Bank Details</h2>
            </div>
            <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
              <FormField label="Bank Name" value={formData.bankName} onChange={(v) => setFormData(p => ({ ...p, bankName: v }))} />
              <FormField label="Branch" value={formData.bankBranch} onChange={(v) => setFormData(p => ({ ...p, bankBranch: v }))} />
              <FormField label="Account No" value={formData.bankAcNo} onChange={(v) => setFormData(p => ({ ...p, bankAcNo: v }))} />
              <FormField label="IFSC Code" value={formData.bankIFSC} onChange={(v) => setFormData(p => ({ ...p, bankIFSC: v }))} />
            </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", position: "relative" }}>
            <div style={{ padding: "18px 28px", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "16px 16px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fce7f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiShoppingCart style={{ color: "#db2777", fontSize: 18 }} />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Invoice Items</h2>
              </div>
              <button type="button" onClick={addNewItem}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}>
                <FiPlus /> Add Item
              </button>
            </div>
            <div style={{ padding: "24px 28px" }}>
            <div style={{ overflowX: "visible" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#374151" }}>
                    {["Date", "Party DC", "Our DC", "Fabric", "Colour", "Roll", "Weight", "Rate", "Amount", ""].map((h, i) => (
                      <th key={i} style={{ border: "1px solid #4b5563", padding: "10px 8px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#fff" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => (
                    <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ border: "1px solid #d1d5db", padding: 2, position: "relative" }}>
                        <DatePicker
                          selected={parseDateStr(item.date)}
                          onChange={(date: Date | null) => updateItem(item.id, "date", formatDate(date))}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="DD/MM/YYYY"
                          showPopperArrow={false}
                          popperPlacement="bottom-start"
                          todayButton="Today"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="custom-datepicker-table"
                          customInput={
                            <input
                              style={{ width: "100%", padding: "8px 10px", paddingRight: 28, border: "none", fontSize: 13, outline: "none", background: "transparent", cursor: "pointer", minWidth: 120 }}
                            />
                          }
                        />
                        <FiCalendar style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14, pointerEvents: "none" }} />
                      </td>
                      {(["partyDcNo", "ourDcNo", "fabric", "colour", "roll"] as const).map(field => (
                        <td key={field} style={{ border: "1px solid #d1d5db", padding: 2 }}>
                          <input value={item[field]} onChange={(e) => updateItem(item.id, field, e.target.value)}
                            style={{ width: "100%", padding: "8px 10px", border: "none", fontSize: 13, outline: "none", background: "transparent" }} />
                        </td>
                      ))}
                      <td style={{ border: "1px solid #d1d5db", padding: 2 }}>
                        <input type="number" step="0.001" value={item.weight} onChange={(e) => updateItem(item.id, "weight", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", border: "none", fontSize: 13, outline: "none", textAlign: "right", background: "transparent" }} />
                      </td>
                      <td style={{ border: "1px solid #d1d5db", padding: 2 }}>
                        <input type="number" step="0.01" value={item.rate} onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", border: "none", fontSize: 13, outline: "none", textAlign: "right", background: "transparent" }} />
                      </td>
                      <td style={{ border: "1px solid #d1d5db", padding: "8px 10px", textAlign: "right", fontSize: 13, background: "#f1f5f9", fontWeight: 600 }}>
                        {item.amount || "0.00"}
                      </td>
                      <td style={{ border: "1px solid #d1d5db", padding: 2, textAlign: "center" }}>
                        <button type="button" onClick={() => removeItem(item.id)}
                          style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <div style={{ width: 360, background: "#f8fafc", padding: "20px 24px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 500, color: "#374151" }}>Subtotal:</span><span style={{ fontWeight: 600 }}>{totals.subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 500, color: "#374151" }}>CGST @</span>
                    <input type="number" step="0.01" value={formData.cgstRate}
                      onChange={(e) => setFormData(p => ({ ...p, cgstRate: e.target.value }))}
                      style={{ width: 80, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 15, textAlign: "center", background: "#fff", outline: "none", height: 38, boxSizing: "border-box" }} />
                    <span style={{ color: "#6b7280" }}>%</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{totals.cgst}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 500, color: "#374151" }}>SGST @</span>
                    <input type="number" step="0.01" value={formData.sgstRate}
                      onChange={(e) => setFormData(p => ({ ...p, sgstRate: e.target.value }))}
                      style={{ width: 80, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 15, textAlign: "center", background: "#fff", outline: "none", height: 38, boxSizing: "border-box" }} />
                    <span style={{ color: "#6b7280" }}>%</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{totals.sgst}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: "bold", borderTop: "2px solid #4b5563", paddingTop: 10, marginTop: 6, color: "#111827" }}>
                  <span>Net Amount:</span><span>&#8377;{totals.netAmount}</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, paddingBottom: 20 }}>
            <button type="button" onClick={() => router.back()}
              style={{ padding: "12px 28px", border: "2px solid #e2e8f0", borderRadius: 12, background: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 500, color: "#475569", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
            >
              Cancel
            </button>
            <button type="submit"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 32px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 600, boxShadow: "0 4px 14px rgba(59,130,246,0.3)", transition: "all 0.2s" }}>
              <FiEye size={18} /> Preview Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
