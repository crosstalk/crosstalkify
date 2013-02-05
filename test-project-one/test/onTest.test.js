/*
 * onTest.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    onTest = require( '../onTest' ),
    sandbox = require( 'sandboxed-module-strict-mode' );

describe( 'onTest()', function () {

  it( "should emit crosstalk.emit( 'test.response' )", function ( done ) {

    let SANDBOX = {
      globals : {
        crosstalk : {
          emit : function ( message ) {

            assert.equal( message, 'test.response' );
            done();

          }
        }
      }
    };

    let onTest = sandbox.require( '../onTest', SANDBOX );

    onTest();

  });

  it( "should emit crosstalk.emit( 'test.response' ) with no data", function ( done ) {

    let SANDBOX = {
      globals : {
        crosstalk : {
          emit : function ( message, data ) {

            assert( ! data );
            done();

          }
        }
      }
    };

    let onTest = sandbox.require( '../onTest', SANDBOX );

    onTest();

  });

}); // describe onTest()