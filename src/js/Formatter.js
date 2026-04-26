const Formatter = {
  /**
   * @param {number} amount
   * @returns {string}
   */
  currency(amount) {
    return `$${amount.toFixed(2)}`;
  },

  /**
   * @param {number} value
   * @returns {string}
   */
  decimal1(value) {
    return value.toFixed(1);
  },

  /**
   * @param {number} value
   * @returns {string}
   */
  decimal2(value) {
    return value.toFixed(2);
  }
};

 export default Formatter;
