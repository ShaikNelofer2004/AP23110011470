export const Log = {
  info: (message, data) => {
    console.log(message, data || '');
  },
  error: (message, error) => {
    console.error(message, error || '');
  },
  warn: (message, data) => {
    console.warn(message, data || '');
  }
};
