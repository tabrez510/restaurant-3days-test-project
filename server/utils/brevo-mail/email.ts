import {
  generatePasswordResetEmailHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} from "./htmlEmail";
import { apiInstance, sender } from "./brevo"; // Updated import

// Function to send verification email
export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  email = email.trim();
  const html = htmlContent.replace("{verificationToken}", verificationToken);

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: { email: sender.email, name: sender.name },
      to: [{ email }],
      subject: "Verify your email",
      htmlContent: html,
    });
  } catch (error) {
    console.error("Failed to send email verification:", error);
    throw new Error("Failed to send email verification");
  }
};


// Function to send welcome email
export const sendWelcomeEmail = async (email: string, name: string) => {
  email = email.trim();
  const html = generateWelcomeEmailHtml(name);

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: { email: sender.email, name: sender.name },
      to: [{ email }],
      subject: "Welcome to FoodHub",
      htmlContent: html,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
) => {
  email = email.trim();
  const html = generatePasswordResetEmailHtml(resetURL);

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: { email: sender.email, name: sender.name },
      to: [{ email }],
      subject: "Reset your password",
      htmlContent: html,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Function to send reset success email
export const sendResetSuccessEmail = async (email: string) => {
  email = email.trim();
  const html = generateResetSuccessEmailHtml();

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: { email: sender.email, name: sender.name },
      to: [{ email }],
      subject: "Password Reset Successful",
      htmlContent: html,
    });
  } catch (error) {
    console.error("Failed to send password reset success email:", error);
    throw new Error("Failed to send password reset success email");
  }
};
