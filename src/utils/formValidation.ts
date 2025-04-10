
export type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule[];
};

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
};

export const validateForm = (values: Record<string, any>, rules: ValidationRules): Record<string, string | null> => {
  const errors: Record<string, string | null> = {};
  
  Object.keys(rules).forEach((field) => {
    errors[field] = validateField(values[field], rules[field]);
  });
  
  return errors;
};

// Common validation rules
export const required = (message = "This field is required"): ValidationRule => ({
  validate: (value) => value !== undefined && value !== null && value !== "",
  message
});

export const email = (message = "Please enter a valid email address"): ValidationRule => ({
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message
});

export const minLength = (length: number, message = `Must be at least ${length} characters`): ValidationRule => ({
  validate: (value) => value && value.length >= length,
  message
});

export const phoneNumber = (message = "Please enter a valid phone number"): ValidationRule => ({
  validate: (value) => /^(\+?[0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value),
  message
});

export const hasError = (errors: Record<string, string | null>): boolean => {
  return Object.values(errors).some(error => error !== null);
};
