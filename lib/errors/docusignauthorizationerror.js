/**
 * `DocusignAuthorizationError` error.
 *
 * DocusignAuthorizationError represents an error in response to an
 * authorization request on Docusign.
 *
 * References:
 *   - https://docs.docusign.com/esign/guide/usage/requests_and_responses.html#response-status
 *
 * @constructor
 * @param {string} [message]
 * @param {number} [errorCode]
 * @access public
 */
function DocusignAuthorizationError(message, errorCode) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DocusignAuthorizationError';
  this.message = message;
  this.code = errorCode;
  this.status = 500;
}

// Inherit from `Error`.
DocusignAuthorizationError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = DocusignAuthorizationError;
