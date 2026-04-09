export interface FormData {
  // Bill info
  invoiceNumber: string;
  invoiceDate: string;
  serviceCode: string;
  stateName: string;
  stateCode: string;

  // Seller info
  sellerName: string;
  sellerAddress1: string;
  sellerAddress2: string;
  sellerCity: string;
  sellerPincode: string;
  sellerPhone1: string;
  sellerPhone2: string;
  sellerGSTIN: string;

  // Buyer info
  buyerName: string;
  buyerAddress1: string;
  buyerAddress2: string;
  buyerCity: string;
  buyerPincode: string;
  buyerGSTIN: string;

  // Item row fields
  items: {
    itemDate: string;
    partyDcNo: string;
    ourDcNo: string;
    fabric: string;
    colour: string;
    roll: string;
    weight: string;
    rate: string;
    amount: string;
  }[];

  // Summary fields
  totalWeight: string;
  subtotal: string;
  cgstPercent: string;
  cgstAmount: string;
  sgstPercent: string;
  sgstAmount: string;
  netAmount: string;
  amountInWords: string;

  // Footer fields
  remarks: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  receivedBy: string;
  authorizedSignatory: string;
  signatureUpload: string;
}
