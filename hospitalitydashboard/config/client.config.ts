// config/client.config.ts
export const clientConfig = {
  clientId: "client_001",              // swap per client later
  businessName: "Grand Palm Hotel",
  driveMode: "self_hosted",            // "self_hosted" | "client_oauth"
  driveFolderId: process.env.DRIVE_FOLDER_ID,
  serviceAccountKey: process.env.GOOGLE_SERVICE_KEY, // self_hosted
  oauthToken: null,                    // client_oauth mode
  accountantEmail: process.env.ACCOUNTANT_EMAIL,
  alertDays: { inspections: 30, licenses: 60 },
};