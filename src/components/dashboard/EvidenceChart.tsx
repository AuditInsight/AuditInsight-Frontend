import { Card } from "@/components/ui/card/card"

type EvidenceItem = {
    name: string;
    coverage: number
}

const evidenceData: EvidenceItem[] = [
    { name: "Invoices", coverage: 85 },
    { name: "Contracts", coverage: 70 },
    { name: "Reciepts", coverage: 55 },
    { name: "Approvals", coverage: 80 },
]

export default function EvidenceChart() {
   
return (
  <Card>
    <h3>Evidence Coverage</h3>

    {evidenceData.map((item) => (
      <div key={item.name}>
        <span>{item.name}</span>
        <span>{item.coverage}%</span>
      </div>
    ))}
  </Card>
)
}