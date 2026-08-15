export type Certification = {
  issuer: string;
  credential: string;
  status: "COMPLETED" | "IN PROGRESS";
  track: string;
};

export const certifications: Certification[] = [
  { issuer: "Cisco Networking Academy", credential: "CCNA: Introduction to Networks", status: "COMPLETED", track: "NETWORKING" },
  { issuer: "Cisco Networking Academy", credential: "Switching, Routing & Wireless Essentials", status: "COMPLETED", track: "NETWORKING" },
  { issuer: "Cisco Networking Academy", credential: "Network Support and Security", status: "COMPLETED", track: "NETWORK + SECURITY" },
  { issuer: "Cisco Networking Academy", credential: "Endpoint Security", status: "COMPLETED", track: "SECURITY" },
  { issuer: "Fortinet", credential: "Introduction to Threat Landscape 3.0", status: "COMPLETED", track: "SECURITY" },
  { issuer: "Cloud Security Alliance", credential: "CCSK v5", status: "IN PROGRESS", track: "CLOUD SECURITY" },
];
