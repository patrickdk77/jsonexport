/* jshint node:true */
'use strict';

// Escape the textDelimiters contained in the field
/*(https://tools.ietf.org/html/rfc4180)
   7.  If double-quotes are used to enclose fields, then a double-quote
   appearing inside a field must be escaped by preceding it with
   another double quote.
   For example: "aaa","b""bb","ccc"
*/

module.exports = function escapedDelimiters(textDelimiter, rowDelimiter, forceTextDelimiter, forceTextStrings) {  
  let endOfLine = '\n';

  if (typeof textDelimiter !== 'string') {
    throw new TypeError('Invalid param "textDelimiter", must be a string.');
  }

  if (typeof rowDelimiter !== 'string') {
    throw new TypeError('Invalid param "rowDelimiter", must be a string.');
  }

  let textDelimiterRegex = new RegExp("\\" + textDelimiter, 'g');
  let escapedDelimiter = textDelimiter + textDelimiter;

  const enclosingCondition = (textDelimiter === '"') ? 
    (value) => (value.indexOf(rowDelimiter) >= 0 || 
        value.indexOf(endOfLine) >= 0 ||
        value.indexOf('"') >= 0)
    : (value) => (value.indexOf(rowDelimiter) >= 0 || 
        value.indexOf(endOfLine) >= 0);

  return function(value) {
    let force=forceTextDelimiter;
    if(forceTextStrings && typeof(value)==='string') force=true;
    
    if(force) value = "" + value;

    if (!value.replace) return value;
    // Escape the textDelimiters contained in the field
    value = value.replace(textDelimiterRegex, escapedDelimiter);
    
    // Escape the whole field if it contains a rowDelimiter or a linebreak or double quote
    if (force || enclosingCondition(value)) {
      value = textDelimiter + value + textDelimiter;
    }

    return value;
  };
};
