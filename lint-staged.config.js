module.exports = {
  "*.{ts}": () => ["npm run format:fix", "npm run validate"],
};
