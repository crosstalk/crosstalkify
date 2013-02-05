/*
 * crosstalkify.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    crosstalkify = require( '../index' ),
    events = require( 'events' ),
    path = require( 'path' ),
    sandbox = require( 'sandboxed-module-strict-mode' );

describe( 'crosstalkify', function () {

  it( "should be implemented", function () {
    assert.fail();
  });

  it( "should return an EventEmitter", function () {
    assert( crosstalkify() instanceof events.EventEmitter );
  });

  it( "should have a configuration object", function () {
    assert.equal( typeof( crosstalkify().configuration ), 'object' );
  });

  describe( "configuration object", function () {

    it( "should have default 'directory' of process.cwd()", function () {

      let instance = crosstalkify();
      let cwd = process.cwd();

      assert.equal( instance.configuration.directory, cwd );

    });

    describe( "initialization", function () {

      it( "should configure directory from options by resolving it", function () {

        let instance = crosstalkify( { directory : './some/dir' } );
        let resolvedDir = path.resolve( './some/dir' );

        assert.equal( instance.configuration.directory, resolvedDir );

      });

    }); // describe initialization

  }); // describe configuration object

}); // describe crosstalkify