// A type is like a blueprint
//it tells the system what a transaction must look like

export type TransactionStatus = 
| "New"
| "Flagged"
| "Reviewed"
| "Overdue"
|"Missing";

    // This is the main Transasction structure
    export interface Transaction{
    id: string;  // "TXN10561"
    date: string;   //"TXN10561"
    amount: number;   // 15000
    counterparty: string;  // "XYZ Corp"
    source: "Bank" | "Excel";  //ONLY these values allowed


    evidence: number;   // % (0 - 100)
    riskScore: number;  //  % (0 - 100)

    status: TransactionStatus;  // "New" | "Flagged" | "Reviewed" | "Overdue" | "Missing"
    }

