// client/src/utils/validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return (
    username.length >= 3 &&
    username.length <= 30 &&
    /^[a-zA-Z0-9_]+$/.test(username)
  );
};

export const isCollegeEmail = (email) => {
  const collegeDomains = [".edu", ".ac.in", ".edu.in", ".ac.uk", ".edu.au"];
  return collegeDomains.some((domain) => email.toLowerCase().endsWith(domain));
};
