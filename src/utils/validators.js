// ============================================
// Code2Project - Validation Utilities
// ============================================

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message, field = null, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.errors = errors;
  }
}

/**
 * Email validation
 */
export function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return {
    isValid: re.test(String(email).toLowerCase()),
    error: re.test(String(email).toLowerCase()) 
      ? null 
      : 'Invalid email format'
  };
}

/**
 * Password validation
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  
  if (/[a-z]/.test(password)) strength += 10;
  if (/[A-Z]/.test(password)) strength += 10;
  if (/\d/.test(password)) strength += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
  
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) strength += 10;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) strength += 10;

  return Math.min(100, strength);
}

/**
 * URL validation
 */
export function validateURL(url) {
  try {
    const urlObj = new URL(url);
    return {
      isValid: true,
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname
    };
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format'
    };
  }
}

/**
 * Phone number validation (supports multiple formats)
 */
export function validatePhone(phone, countryCode = 'US') {
  const patterns = {
    US: /^(\+1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    UK: /^(\+44)?[-.\s]?([0-9]{4})[-.\s]?([0-9]{6})$/,
    INTL: /^\+?[1-9]\d{1,14}$/
  };

  const pattern = patterns[countryCode] || patterns.INTL;
  return {
    isValid: pattern.test(phone),
    error: pattern.test(phone) ? null : `Invalid ${countryCode} phone number`
  };
}

/**
 * Credit card validation (Luhn algorithm)
 */
export function validateCreditCard(cardNumber) {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }

  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: 'Invalid card number length' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0;
  
  return {
    isValid,
    error: isValid ? null : 'Invalid card number',
    type: getCardType(cleaned)
  };
}

/**
 * Detect credit card type
 */
function getCardType(number) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^(?:2131|1800|35\d{3})/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) return type;
  }

  return 'unknown';
}

/**
 * Date validation
 */
export function validateDate(dateString, format = 'YYYY-MM-DD') {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  return {
    isValid: true,
    date,
    formatted: formatDate(date, format)
  };
}

/**
 * Format date
 */
function formatDate(date, format) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Age validation
 */
export function validateAge(birthdate, minAge = 0, maxAge = 150) {
  const birth = new Date(birthdate);
  const today = new Date();
  
  if (isNaN(birth.getTime())) {
    return { isValid: false, error: 'Invalid birthdate' };
  }

  const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));

  if (age < minAge) {
    return { isValid: false, error: `Must be at least ${minAge} years old` };
  }

  if (age > maxAge) {
    return { isValid: false, error: 'Invalid age' };
  }

  return { isValid: true, age };
}

/**
 * File validation
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = []
  } = options;

  const errors = [];

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${formatBytes(maxSize)}`);
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      errors.push(`File extension must be one of: ${allowedExtensions.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    size: file.size,
    type: file.type,
    name: file.name
  };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Username validation
 */
export function validateUsername(username, options = {}) {
  const {
    minLength = 3,
    maxLength = 20,
    allowSpecialChars = false
  } = options;

  const errors = [];

  if (username.length < minLength) {
    errors.push(`Username must be at least ${minLength} characters`);
  }

  if (username.length > maxLength) {
    errors.push(`Username must be no more than ${maxLength} characters`);
  }

  const pattern = allowSpecialChars 
    ? /^[a-zA-Z0-9_.-]+$/ 
    : /^[a-zA-Z0-9]+$/;

  if (!pattern.test(username)) {
    errors.push(
      allowSpecialChars
        ? 'Username can only contain letters, numbers, dots, dashes, and underscores'
        : 'Username can only contain letters and numbers'
    );
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Zip code validation
 */
export function validateZipCode(zipCode, country = 'US') {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i
  };

  const pattern = patterns[country];
  if (!pattern) {
    return { isValid: false, error: 'Unsupported country code' };
  }

  return {
    isValid: pattern.test(zipCode),
    error: pattern.test(zipCode) ? null : `Invalid ${country} zip code`
  };
}

/**
 * Validate form data
 */
export function validateForm(data, rules) {
  const errors = {};
  let isValid = true;

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    const fieldErrors = [];

    // Required validation
    if (fieldRules.required && !value) {
      fieldErrors.push(`${field} is required`);
    }

    // Custom validators
    if (value && fieldRules.validators) {
      for (const validator of fieldRules.validators) {
        const result = validator(value);
        if (!result.isValid) {
          fieldErrors.push(result.error || `Invalid ${field}`);
        }
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Sanitize input
 */
export function sanitizeInput(input, options = {}) {
  const {
    allowHTML = false,
    maxLength = null,
    trim = true
  } = options;

  let sanitized = String(input);

  if (trim) {
    sanitized = sanitized.trim();
  }

  if (!allowHTML) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate JSON
 */
export function validateJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return { isValid: true, data: parsed };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid JSON format',
      details: error.message 
    };
  }
}

/**
 * Validate array
 */
export function validateArray(arr, options = {}) {
  const {
    minLength = 0,
    maxLength = Infinity,
    itemValidator = null
  } = options;

  if (!Array.isArray(arr)) {
    return { isValid: false, error: 'Not an array' };
  }

  if (arr.length < minLength) {
    return { isValid: false, error: `Array must have at least ${minLength} items` };
  }

  if (arr.length > maxLength) {
    return { isValid: false, error: `Array must have no more than ${maxLength} items` };
  }

  if (itemValidator) {
    const invalidItems = [];
    arr.forEach((item, index) => {
      const result = itemValidator(item);
      if (!result.isValid) {
        invalidItems.push({ index, error: result.error });
      }
    });

    if (invalidItems.length > 0) {
      return { isValid: false, errors: invalidItems };
    }
  }

  return { isValid: true };
}

/**
 * Validate object
 */
export function validateObject(obj, schema) {
  if (typeof obj !== 'object' || obj === null) {
    return { isValid: false, error: 'Not an object' };
  }

  const errors = {};
  let isValid = true;

  for (const [key, validator] of Object.entries(schema)) {
    const result = validator(obj[key]);
    if (!result.isValid) {
      errors[key] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Common validators
 */
export const validators = {
  email: validateEmail,
  password: validatePassword,
  url: validateURL,
  phone: validatePhone,
  creditCard: validateCreditCard,
  date: validateDate,
  age: validateAge,
  file: validateFile,
  username: validateUsername,
  zipCode: validateZipCode,
  json: validateJSON,
  array: validateArray,
  object: validateObject
};

// Export as default
export default validators;
