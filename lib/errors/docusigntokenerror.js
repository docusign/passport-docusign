/**
 * `DocusignTokenError` error.
 *
 * DocusignTokenError represents an error received from a Docusign's token
 * endpoint.
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
function DocusignTokenError(message, type, code, subcode, errorCode, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DocusignTokenError';
  this.message = message;
  this.type = type;
  this.code = code;
  this.subcode = subcode;
  this.status = status || 500;
  this.errorCode = errorCode;
}

// Inherit from `Error`.
DocusignTokenError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = DocusignTokenError;
