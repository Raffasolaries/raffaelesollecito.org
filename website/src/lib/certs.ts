export interface Cert {
  name: string;
  short: string;
  level: "professional" | "specialty" | "associate" | "foundational";
  /** Exam-based AWS certification, or an AWS badge (SME programme, partner accreditation). */
  kind: "certification" | "badge";
  badgeId: string;
}

export const CREDLY_PROFILE = "https://www.credly.com/users/raffasolaries";

/** Canonical Credly badge IDs (checked against credly.com/users/raffasolaries on 2026-10-23). */
export const CERTS: Cert[] = [
  { name: "AWS Certified Solutions Architect – Professional", short: "SA Professional", level: "professional", kind: "certification", badgeId: "99577450-4c19-4e55-bdc6-40f0cce3d409" },
  { name: "AWS Certified Security – Specialty", short: "Security Specialty", level: "specialty", kind: "certification", badgeId: "20256e01-69c8-48f0-b139-e3468b9f5837" },
  { name: "AWS Certified Solutions Architect – Associate", short: "SA Associate", level: "associate", kind: "certification", badgeId: "444d562c-5309-4032-ba4a-69f5f7a9cb56" },
  { name: "AWS Certified Cloud Practitioner", short: "Cloud Practitioner", level: "foundational", kind: "certification", badgeId: "57bb249a-e5ea-42b1-a2b7-6c6c33f3bde4" },
  { name: "AWS Certification Subject Matter Expert – Associate", short: "Certification SME", level: "associate", kind: "badge", badgeId: "4e97dcd1-25dc-4b26-8872-3a98899aef64" },
  { name: "AWS Partner: Technical Accredited", short: "Partner Technical", level: "associate", kind: "badge", badgeId: "5c9c82af-b374-4e72-971f-a9e576007cca" },
];

export const badgeUrl = (c: Cert) => `https://www.credly.com/badges/${c.badgeId}`;
