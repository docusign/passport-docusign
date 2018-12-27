/**
 * `DocusignAPIError` error.
 *
 * References:
 *   - https://docs.docusign.com/esign/guide/usage/requests_and_responses.html#response-status
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [type]
 * @param {number} [code]
 * @param {number} [subcode]
 * @param {string} [errorCode]
 * @access public
 */
function DocusignAPIError(message, type, code, subcode, errorCode) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DocusignAPIError';
  this.message = message;
  this.type = type;
  this.code = code;
  this.subcode = subcode;
  this.status = 500;
  this.errorCode = errorCode;
}

// Inherit from `Error`.
DocusignAPIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = DocusignAPIError;
