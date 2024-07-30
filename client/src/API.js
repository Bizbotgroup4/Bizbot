let baseURL = "http://localhost:5000";

if (process.env.NODE_ENV === "production") {
  baseURL = "https://bizbot-api.azurewebsites.net";
}

export const loginAPI = `${baseURL}/sign-in`;
export const registerAPI = `${baseURL}/sign-up`;
export const onboardingFormAPI = `${baseURL}/onboarding`;
export const getCustomerAPI = `${baseURL}/get-customer`;
export const profileAPI = `${baseURL}/profile`;
export const campaignsAPI = `${baseURL}/campaigns`;
export const productsAPI = `${baseURL}/products`;
export const twilioConfigAPI = `${baseURL}/twilio-config`;
export const sendContactDetailsAPI = `${baseURL}/send-contact-details`;
export { baseURL };
