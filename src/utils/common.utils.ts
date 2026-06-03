/** Remove email blankspaces & convert to lowercase */
const normalizeEmail = (email: string) => {
  return email.replace(/\s+/g, '').toLowerCase();
};

export const commonUtils = { normalizeEmail };
