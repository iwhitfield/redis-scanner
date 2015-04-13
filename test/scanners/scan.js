var redis = require('redis');
var should = require('should');

var client = redis.createClient();

require('../../index').bindScanners(client);

describe('SCAN', function(){

    describe('using standard configuration', function(){

        before('bootstrap keys', function(start){

            client.send_command('debug', ['populate', 50], function(err, result){
                should(err).not.be.ok;
                should(result).eql('OK');

                start();
            });

        });

        it('iterates through all keys', function(next){

            var count = 0;

            client.scan({
                onData: function(){
                    count++;
                },
                onEnd: function(){
                    should(count).eql(50);
                    next();
                },
                onError: next
            });

        });

        it('allows asynchronous execution', function(next){

            var count = 0;
            var results = [];

            client.scan({
                onData: function(key, done){
                    setTimeout(function(){
                        results.push(count++);
                        done();
                    }, 10);
                },
                onEnd: function(err){
                    should(err).not.be.ok;
                    should(count).eql(50);

                    var counter = 0;
                    results.forEach(function(result){
                        should(result).eql(counter++);
                    });

                    next();
                }
            });

        });

        it('allows pattern matching', function(next){

            var count = 0;

            client.scan({
                pattern: 'key:1*',
                onData: function(key){
                    should(key).match(/key:1*/);
                    count++;
                },
                onEnd: function(){
                    should(count).eql(11);
                    next();
                },
                onError: next
            });

        });

        it('exits when specified', function(next){

            var count = 0;

            client.scan({
                onData: function(){
                    if(count++ === 5){
                        this.end();
                    }
                },
                onEnd: function(){
                    should(count).eql(6);
                    next();
                },
                onError: next
            });

        });

        it('can use upper case method names', function(next){

            var count = 0;

            client.SCAN({
                onData: function(){
                    if(count++ === 5){
                        this.end();
                    }
                },
                onEnd: function(){
                    should(count).eql(6);
                    next();
                },
                onError: next
            });

        });

        after(function(done){
            client.flushdb(done);
        });

    });

    describe('using options configuration', function(){

        before('bootstrap keys', function(start){

            client.send_command('debug', ['populate', 50], function(err, result){
                should(err).not.be.ok;
                should(result).eql('OK');

                start();
            });

        });

        it('iterates through all keys', function(next){

            var count = 0;

            client.scan(function(){
                count++;
            }, function(err){
                should(err).not.be.ok;
                should(count).eql(50);
                next();
            });

        });

        it('allows asynchronous execution', function(next){

            var count = 0;
            var results = [];

            client.scan(function(key, done){
                setTimeout(function(){
                    results.push(count++);
                    done();
                }, 10);
            }, function(err){
                should(err).not.be.ok;
                should(count).eql(50);

                var counter = 0;
                results.forEach(function(result){
                    should(result).eql(counter++);
                });

                next();
            });

        });

        it('allows pattern matching', function(next){

            var count = 0;

            client.scan(['MATCH','key:1*'], function(key){
                should(key).match(/key:1*/);
                count++;
            }, function(err){
                should(err).not.be.ok;
                should(count).eql(11);
                next();
            });

        });

        it('exits when specified', function(next){

            var count = 0;

            client.scan(function(){
                if(count++ === 5){
                    this.end();
                }
            }, function(err){
                should(err).not.be.ok;
                should(count).eql(6);
                next();
            });

        });

        it('can use upper case method names', function(next){

            var count = 0;

            client.SCAN(function(){
                if(count++ === 5){
                    this.end();
                }
            }, function(err){
                should(err).not.be.ok;
                should(count).eql(6);
                next();
            });

        });

        after(function(done){
            client.flushdb(done);
        });

    });

});