var assert = require('assert');


var app = require('express')();

app.set('controllers',__dirname +'/controllers/');

require('../index')(app);

describe('express-map2',function(){
	
	describe('#map()',function(){
		
		it('should return undefined when used correctly WITHOUT route prefix.', function() {
			
			var test1Result = app.map({
				'GET /':'test',
			});

			assert.equal(void 0,test1Result);
		});
		
		it('should return undefined when used correctly WITH middleware.', function() {
			
			var test1Result = app.map({
				'GET /foo':'middleware.foo,test',
				'GET /bar':'middleware.bar,test'
			});

			assert.equal(void 0,test1Result);
		});
		
		it('should return undefined when used correctly WITH route prefix.', function() {
			
			var test2Result = app.map('/books',{
				'GET /': 'books.list',
				'GET /:id': 'books.loadOne',
				'DELETE /:id': 'books.delete',
				'PUT /:id': 'books.update',
				'POST /': 'books.create'
			});

			assert.equal(void 0,test2Result);
		});
		
		it('should throw an exception when called without arguments.',function() {
			
			
			try{
				app.map();
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw an exception when prefix is not a string.',function(){
			
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
		
		it('should throw an exception when routes is not an object.',function(){
			
			try{
				app.map('/books-new2',function(){});
				assert.equal(false, true);//failing test case
			}
			catch(e){
				assert.equal(e instanceof Error,true);
			}
			
		});
		
		it('should throw an exception when unable to parse routes.',function(){
			
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
		
		it('should throw an exception when encountering invalid verb/route pair.',function(){
			
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
		
		it('should throw an exception when invalid http verb is given.',function(){
			
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
		
		it('should throw an exception when handler(s) is not a string.',function(){
			
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
		
		it('should throw an exception when controller doesnt exist.',function(){
			
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
		
		it('should throw an exception when handler is not a function.',function(){
			
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