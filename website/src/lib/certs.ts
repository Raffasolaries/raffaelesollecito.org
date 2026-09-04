export interface Cert {
  name: string;
  short: string;
  level: "professional" | "specialty" | "associate" | "foundational";
  badgeId: string;
}

export const CREDLY_PROFILE = "https://www.credly.com/users/raffasolaries";

export const CERTS: Cert[] = [
  { name: "AWS Certified Solutions Architect – Professional", short: "SA Professional", level: "professional", badgeId: "1bf12aa4-d1ad-4178-96f9-b15bee1f7fde" },
  { name: "AWS Certified Security – Specialty", short: "Security Specialty", level: "specialty", badgeId: "20256e01-69c8-48f0-b139-e3468b9f5837" },
  { name: "AWS Certified Solutions Architect – Associate", short: "SA Associate", level: "associate", badgeId: "d2bcc5cd-06d7-431c-b96b-88027da8fdef" },
  { name: "AWS Certification Subject Matter Expert – Associate", short: "Certification SME", level: "associate", badgeId: "84f7bf87-5948-4b0e-8afe-3f5193d85883" },
  { name: "AWS Partner: Technical Accredited", short: "Partner Technical", level: "associate", badgeId: "5c9c82af-b374-4e72-971f-a9e576007cca" },
  { name: "AWS Certified Cloud Practitioner", short: "Cloud Practitioner", level: "foundational", badgeId: "a93d8bd5-9e9d-4aa6-98c3-fe49592ac2da" },
];

export const badgeUrl = (c: Cert) => `https://www.credly.com/badges/${c.badgeId}`;
