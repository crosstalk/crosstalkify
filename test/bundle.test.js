/*
 * bundle.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    bundle = require( '../bundle' ),
    path = require( 'path' ),
    sandbox = require( 'sandboxed-module-strict-mode' );

describe( 'bundle()', function () {

  it( "should be implemented", function () {
    assert.fail();
  });

  let CROSSTALKIFY;

  beforeEach( function () {

    CROSSTALKIFY = {
      configuration : {
        directory : process.cwd()
      }
    };

  });

  it( "should provide configuration.directory/index.js as entry point to " +
     "browserify if package.json does not contain 'main'", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );

    let SANDBOX = {
      requires : {
        'browserify' : function ( entry ) {

          assert.equal( entry, 
             path.resolve( 
                path.join( CROSSTALKIFY.configuration.directory, 'index.js' ) 
             ) 
          );
          done();
          return { bundle : function () {} };

        }
      }
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

  });

  it( "should provide configuration.directory/<main> as entry point to " +
     "browserify if package.json contains 'main'", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'with-main' ) );

    let SANDBOX = {
      requires : {
        'browserify' : function ( entry ) {

          assert.equal( entry, 
             path.resolve( 
                path.join( CROSSTALKIFY.configuration.directory, 'myEntry.js' ) 
             ) 
          );
          done();
          return { bundle : function () {} };

        }
      }
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

  });

  it( "should return output of browserify( entry ).bundle()", function () {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );

    let SANDBOX = {
      requires : {
        'browserify' : function ( entry ) {          
          return { 
            bundle : function () {
              return 'stuff';
            } 
          };
        }
      }
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    assert.equal( 'stuff', bundle.call( CROSSTALKIFY ) );

  });

}); // describe bundle()