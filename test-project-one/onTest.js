/*
 * onTest.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var onTest = function onTest ( params, callback ) {
  crosstalk.emit( 'test.response' );
};

module.exports = onTest;