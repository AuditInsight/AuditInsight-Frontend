export interface Evidance {
    id: string;              // EVD12345
    name: string;            // "Invoice from ABC Corp"
    category: string;        // "Invoice", "Contract", "Email"
    amount: number;          // 1234.56 (if applicable)
    date: string;            // "2024-06-01"

    transactionIds: string[]; // links to transactions
    status: "Verified" | "Pending" | "Missing";
}