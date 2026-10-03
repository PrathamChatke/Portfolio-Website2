const config = {
  serviceId: import.meta.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

export const isEmailConfigured = () => Boolean(config.serviceId && config.templateId && config.publicKey);

/** Send the contact form through EmailJS. Throws on failure or missing config. */
export async function sendContactEmail({ name, email, subject, message }) {
  if (!isEmailConfigured()) throw new Error("EmailJS is not configured (see .env.example).");
  const { default: emailjs } = await import("@emailjs/browser");
  return emailjs.send(
    config.serviceId,
    config.templateId,
    { from_name: name, from_email: email, reply_to: email, subject, message },
    { publicKey: config.publicKey }
  );
}
