import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Brevo API client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
  email: "alamtabrez510@gmail.com",
  name: "Md Tabrez Alam",
};

// Export both the apiInstance and sender
export { apiInstance, sender };
