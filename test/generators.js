
var c0 = require('..');
var assert = require('assert');

function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  }
}

function *moreWork(calls) {
  calls.push('three');
  yield sleep(50);
  calls.push('four');
}

function *work() {
  var calls = [];
  calls.push('one');
  yield sleep(50);
  calls.push('two');
  yield moreWork(calls);
  calls.push('five');
  return calls;
}

describe('c0(fn)', function(){
  describe('with a generator', function(){
    it('should wrap with c0()', function(done){
      c0(function *(){
        var calls = yield work();
        calls.should.eql(['one', 'two', 'three', 'four', 'five']);

        var a = work();
        var b = work();
        var c = work();

        var calls = yield [a, b, c];
        calls.should.eql([
          [ 'one', 'two', 'three', 'four', 'five' ],
          [ 'one', 'two', 'three', 'four', 'five' ],
          [ 'one', 'two', 'three', 'four', 'five' ] ]);

      })(done);
    })

    it('should catch errors', function(done){
      c0(function *(){
        yield function *(){
          throw new Error('boom');
        }();
      })(function(err){
        assert(err);
        assert(err.message == 'boom');
        done();
      });
    })
  })
})
