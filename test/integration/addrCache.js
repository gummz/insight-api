#!/usr/bin/env node

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var assert = require('assert'),
  fs = require('fs'),
  Address = require('../../app/models/Address'),
  TransactionDb = require('../../lib/TransactionDb').default(),
  addrValid = JSON.parse(fs.readFileSync('test/integration/addr.json')),
  utxoValid = JSON.parse(fs.readFileSync('test/integration/utxo.json'));

var should = require('chai');

var txDb;


describe('Address cache ', function() {
  this.timeout(5000);

  before(function(c) {
    txDb = TransactionDb;
    txDb.deleteCacheForAddress('muAt5RRqDarPFCe6qDXGZc54xJjXYUyepG',function(){
     txDb.deleteCacheForAddress('mt2AzeCorSf7yFckj19HFiXJgh9aNyc4h3',function(){
      txDb.deleteCacheForAddress('2N7zvqQTUYFfhYvFs1NEzureMLvhwk5FSsk',c);
     });

    });
  });



  it('cache case 1 w/o cache', function(done) {
    var a = new Address('muAt5RRqDarPFCe6qDXGZc54xJjXYUyepG', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0, 'balance');
      a.totalReceived.should.equal(19175, 'totalReceived');
      a.txApperances.should.equal(2, 'txApperances');
      return done();
    });
  });
   it('cache case 1 w cache', function(done) {
    var a = new Address('muAt5RRqDarPFCe6qDXGZc54xJjXYUyepG', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0, 'balance');
      a.totalReceived.should.equal(19175, 'totalReceived');
      a.txApperances.should.equal(2, 'txApperances');
      return done();
    });
  });
 


  it('cache case 2  w/o cache', function(done) {
    var a = new Address('2N7zvqQTUYFfhYvFs1NEzureMLvhwk5FSsk', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0.23, 'balance');
      a.totalReceived.should.equal(0.23, 'totalReceived');
      a.txApperances.should.equal(1, 'txApperances');
      return done();
    });
  });
 
  it('cache case 2  w cache', function(done) {
    var a = new Address('2N7zvqQTUYFfhYvFs1NEzureMLvhwk5FSsk', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0.23, 'balance');
      a.totalReceived.should.equal(0.23, 'totalReceived');
      a.txApperances.should.equal(1, 'txApperances');
      return done();
    });
  });

  it('cache case 2 unspent wo cache', function(done) {
    txDb.deleteCacheForAddress('2N7zvqQTUYFfhYvFs1NEzureMLvhwk5FSsk',function() {
      var a = new Address('2N7zvqQTUYFfhYvFs1NEzureMLvhwk5FSsk', txDb);
      a.update(function(err) {
        if (err) done(err);
        a.unspent.length.should.equal(1);
        a.unspent[0].confirmations.should.be.above(15000);
        a.unspent[0].confirmationsFromCache.should.equal(false);
        return done();
      }, {onlyUnspent:1});
    });
  });

  it('cache case 2 unspent w cache', function(done) {
    var a = new Address('2N7zvqQTUYFfhYvFs1NEzureMLvhwk5FSsk', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.unspent.length.should.equal(1);
      a.unspent[0].confirmationsFromCache.should.equal(true);
      a.unspent[0].confirmations.should.equal(6);
      return done();
    }, {onlyUnspent:1});
  });


 
  it('cache case 3 w/o cache', function(done) {
    var a = new Address('mt2AzeCorSf7yFckj19HFiXJgh9aNyc4h3', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0, 'balance');
      a.totalReceived.should.equal(1376000, 'totalReceived');
      a.txApperances.should.equal(8003, 'txApperances');
      return done();
    });
  },1);
  it('cache case 4 w cache', function(done) {
    var a = new Address('mt2AzeCorSf7yFckj19HFiXJgh9aNyc4h3', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0, 'balance');
      a.totalReceived.should.equal(1376000, 'totalReceived');
      a.txApperances.should.equal(8003, 'txApperances');
      return done();
    },{txLimit:0});
  });
  it('cache case 4 w ignore cache', function(done) {
    var a = new Address('mt2AzeCorSf7yFckj19HFiXJgh9aNyc4h3', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.balance.should.equal(0, 'balance');
      a.totalReceived.should.equal(1376000, 'totalReceived');
      a.txApperances.should.equal(8003, 'txApperances');
      return done();
    },{txLimit:0, ignoreCache:1});
  });

  it('cache case 5 unspent w cache', function(done) {
    var a = new Address('2NBuTjjZrURxLaMyPUu2sJwNrtpt7GtPX2p', txDb);
    a.update(function(err) {
      if (err) done(err);
      a.unspent.length.should.equal(1);
      a.unspent[0].confirmationsFromCache.should.equal(true);
      a.unspent[0].confirmations.should.equal(6);
      return done();
    }, {onlyUnspent:1});
  });
 


});

