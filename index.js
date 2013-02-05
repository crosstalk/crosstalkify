/*
 * index.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var bundle = require( './bundle' ),
    events = require( 'events' ),
    path = require( 'path' );

var crosstalkify = function crosstalkify ( options ) {

  options = options || {};

  var emitter = new events.EventEmitter();

  emitter.configuration = {
    directory : 
       options.directory ? path.resolve( options.directory ) : process.cwd()
  };

  emitter.bundle = bundle;

  return emitter;

}; // crosstalkify

module.exports = crosstalkify;