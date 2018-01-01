var assert = require('assert');

var app = require('express')();

app.set('controllers',__dirname +'/controllers/');

require('../index')(app);

describe('express-map2',function(){
	
	describe('#map()',function(){
		
		it('should return undefined when called with routes.', function() {
			
			var test1Result = app.map({
				'GET /':'test',
			});

			assert.equal(void 0,test1Result);
		});
		
		it('should return undefined when called with route-level middleware.', function() {
			
			var test1Result = app.map({
				'GET /foo':'middleware.foo,test',
				'GET /bar':'middleware.bar,test'
			});

			assert.equal(void 0,test1Result);
		});
		
		it('should return undefined when called WITH route prefix.', function() {
			
			var test2Result = app.map('/books',{
				'GET /': 'books.list',
				'GET /:id': 'books.loadOne',
				'DELETE /:id': 'books.delete',
				'PUT /:id': 'books.update',
				'POST /': 'books.create'
			});

			assert.equal(void 0,test2Result);
		});

		it('should return undefined called with prefix, middleware, and routes.', function() {
			
			var middleware = function middleware(req,res,next){next()};

			var test13Result = app.map('/books',middleware,{
				'GET /books-2': 'books.list',
				'GET /books-2/:id': 'books.loadOne',
				'DELETE /books-2/:id': 'books.delete',
				'PUT /books-2/:id': 'books.update',
				'POST /books-2': 'books.create'
			});

			assert.equal(void 0,test13Result);
		});

		it('should return undefined when called with function middleware and routes.', function() {
			
			var middleware = function middleware(req,res,next){next()};

			var test14Result = app.map(middleware,{
				'GET /books-3': 'books.list',
				'GET /books-3/:id': 'books.loadOne',
				'DELETE /books-3/:id': 'books.delete',
				'PUT /books-3/:id': 'books.update',
				'POST /books-3': 'books.create'
			});

			assert.equal(void 0,test14Result);
		});
        
        //string global middleware support
        it('should return undefined when called with string middleware and routes.', function() {
			
			var test15Result = app.map('middleware.foo',{
				'GET /foo':'test',
				'GET /bar':'test'
			});

			assert.equal(void 0,test15Result);
		});
        
        //string global middleware support
        it('should return undefined when called with prefix, string middleware, and routes.', function() {
			
			var test16Result = app.map('/some-cool-prefix','middleware.foo',{
				'GET /foo':'test',
				'GET /bar':'test'
			});

			assert.equal(void 0,test16Result);
		});
        
        //array of functions and string global middleware support
        it('should return undefined when called with prefix, and mixed array of function/string middlewares, and routes.', function() {
			
            var middleware = function middleware(req,res,next){next()};
            
			var test17Result = app.map('/some-cool-prefix',['middleware.foo',middleware],{
				'GET /foo':'test',
				'GET /bar':'test'
			});

			assert.equal(void 0,test17Result);
		});
		
		it('should throw $e when called without arguments.',function() {
			
			
			try{
				app.map();
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when prefix is not a string.',function(){
			
			try{
				app.map({ route: '/books-new' },{
					'GET /': 'books.list',
					'GET /:id': 'books.loadOne',
					'DELETE /:id': 'books.delete',
					'PUT /:id': 'books.update',
					'POST /': 'books.create'
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
			
		});
		
		it('should throw $e when routes is not an object.',function(){
			
			try{
				app.map('/books-new2',function(){});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when unable to parse routes.',function(){
			
			try{
				app.map('/books-new3',{
					'salfjdslajslfjasl+d':'foo.bar'
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when encountering invalid verb/route pair.',function(){
			
			try{
				app.map('/books-new4',{
					'GET /taldlje aa aa/d POST /get':'foo.bar'
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when invalid http verb is given.',function(){
			
			try{
				app.map('/books-new5',{
					'TEST /foo':'foo.bar'
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when handler(s) is not a string.',function(){
			
			try{
				app.map('/books-new6',{
					'GET /handles': function(){}
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when controller doesnt exist.',function(){
			
			try{
				app.map('/books-new7',{
					'GET /test':'TestController.index'
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw $e when handler is not a function.',function(){
			
			try{
				app.map('/bad-controller',{
					'GET /notAFunction':'BadController.notAFunction'
				});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});

	});
});