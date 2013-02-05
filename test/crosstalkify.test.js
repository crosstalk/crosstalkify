/*
 * crosstalkify.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    crosstalkify = require( '../index' ),
    events = require( 'events' ),
    path = require( 'path' );

describe( 'crosstalkify', function () {

  it( "should return an EventEmitter", function () {
    assert( crosstalkify() instanceof events.EventEmitter );
  });

  [ 'bundle' ].forEach( function ( method ) {

    it( "should have '" + method + "' method", function () {
      assert.strictEqual( crosstalkify()[ method ], require( '../' + method ) );
    });

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