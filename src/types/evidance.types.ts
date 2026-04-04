export interface Evidance {
    id: string;              // EVD12345
    name: string;            // "Invoice from ABC Corp"
    category: string;        // "Invoice", "Contract", "Email"
    type: "Document" | "Image" | "Email" ;
    url:  string;             // link to view/download
    amount: number;          // 1234.56 (if applicable)
    date: string;            // "2024-06-01"

    uploadedBy: string;      // "John Doe"
    uploadedAt: string;      // "2024-06-10T14:30:00Z"

    transactionId: string; // links to transactions
    status: "Verified" | "Pending" | "Missing";
}