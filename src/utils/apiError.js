// Prefer the server's error message over axios' generic "Request failed with status code N".
export const apiErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;
