export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const FIELDS = [
  { id: "all", name: "All Subjects" },
  { id: "Common / First Year", name: "Common / First Year" },
  { id: "Computer Science / AI / IT / Data", name: "Computer Science & AI" },
  { id: "Electronics / Electrical / Embedded", name: "Electrical & Electronics" },
  { id: "Mechanical / Automobile / Aerospace", name: "Mechanical & Aerospace" },
  { id: "Civil / Chemical / Biotech / Biomedical", name: "Civil & Chemical & Biotech" },
];

export function getFieldLabel(fieldId: string) {
  return FIELDS.find(field => field.id === fieldId)?.name ?? fieldId;
}
