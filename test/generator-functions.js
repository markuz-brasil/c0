
var c0 = require('..');
var assert = require('assert');

function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  }
}

function *work() {
  yield sleep(50);
  return 'yay';
}

describe('c0(fn)', function(){
  describe('with a generator function', function(){
    it('should wrap with c0()', function(done){
      c0(function *(){
        var a = yield work;
        var b = yield work;
        var c = yield work;

        assert('yay' == a);
        assert('yay' == b);
        assert('yay' == c);

        var res = yield [work, work, work];
        res.should.eql(['yay', 'yay', 'yay']);
      })(done);
    })

    it('should catch errors', function(done){
      c0(function *(){
        yield function *(){
          throw new Error('boom');
        };
      })(function(err){
        assert(err);
        assert(err.message == 'boom');
        done();
      });
    })
  })
})
