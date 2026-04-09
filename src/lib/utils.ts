export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(num || 0);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

export function numberToWords(num: number): string {
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen"
  ];
  
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
  ];
  
  if (num === 0) return "zero";
  
  function convertHundreds(n: number): string {
    let result = "";
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " hundred ";
      n %= 100;
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    
    if (n > 0) {
      result += ones[n] + " ";
    }
    
    return result.trim();
  }
  
  function convert(n: number): string {
    if (n === 0) return "";
    
    let result = "";
    
    // Crores
    if (n >= 10000000) {
      result += convert(Math.floor(n / 10000000)) + " crore ";
      n %= 10000000;
    }
    
    // Lakhs
    if (n >= 100000) {
      result += convert(Math.floor(n / 100000)) + " lakh ";
      n %= 100000;
    }
    
    // Thousands
    if (n >= 1000) {
      result += convert(Math.floor(n / 1000)) + " thousand ";
      n %= 1000;
    }
    
    // Hundreds
    if (n > 0) {
      result += convertHundreds(n);
    }
    
    return result.trim();
  }
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let result = convert(rupees) + " rupees";
  
  if (paise > 0) {
    result += " and " + convert(paise) + " paise";
  }
  
  return result + " only";
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  
  return `INV${year}${month}${day}${random}`;
}

export function calculateGST(amount: number, rate: number = 18) {
  const gstAmount = (amount * rate) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  
  return {
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    total: Number(gstAmount.toFixed(2))
  };
}