function validateEmail(email) {
    // Regular expression to match a valid email format
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    return regex.test(email); // Returns true if the email matches the pattern, false otherwise
  }

  module.exports = validateEmail