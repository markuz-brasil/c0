
var thunk = require('thunkify');
var c0 = require('..');
var fs = require('fs');

var read = thunk(fs.readFile);

describe('c0(* -> yield [])', function(){
  it('should aggregate several thunks', function(done){
    c0(function *(){
      var a = read('index.js', 'utf8');
      var b = read('Makefile', 'utf8');
      var c = read('package.json', 'utf8');

      var res = yield [a, b, c];
      res.should.have.length(3);
      res[0].should.include('exports');
      res[1].should.include('test');
      res[2].should.include('devDependencies');
    })(done);
  })

  it('should noop with no args', function(done){
    c0(function *(){
      var res = yield [];
      res.should.have.length(0);
    })(done);
  })
})