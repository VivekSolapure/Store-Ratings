export const validateForm = {
  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length < 20) return 'Name must be at least 20 characters';
    if (value.length > 60) return 'Name must be less than 60 characters';
    return '';
  },

  address: (value) => {
    if (!value) return 'Address is required';
    if (value.length > 400) return 'Address must be less than 400 characters';
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (value.length > 16) return 'Password must be less than 16 characters';
    if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
    if (!/[!@#$%^&*]/.test(value)) return 'Password must include a special character';
    return '';
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  }
};
