var controllers = {};//cache controllers.

var Map = function Map(){
	
	
	if(this.get('controllers') === undefined){
		throw new Error("You must use app.set('controllers','/path/to/controllers') to set the controller path before using `express-map`");
	}
	
	var path = this.get('controllers'),
		prefix, 
		object;
		
	switch(true){
		case (arguments.length == 2):
			prefix = arguments[0];
			object = arguments[1];
		break;
		case (arguments.length == 1):
			prefix = '';
			object = arguments[0];
		break;
		default:
			throw new Error('`express-map` encountered invalid argument exception. The function signature accepts either `prefix,object` or `object`')
		break;
	}

	for(var prop in object){
		
		var resource = prop.replace(/\s+/g,' ').replace(/^\s+|\s+$/,'');
		
		if(resource.indexOf(' ') != -1 ){
			
			resource = resource.split(' ');
			
		}else if(prefix.length > 0){
			//handle special case when user wants to get root of prefix.
			resource = [resource[0],''];
		}
		
		var verb = resource[0].toLowerCase();
		
		//create routePath from prefix and actual path. replace duplicate slashes
		var routePath = (prefix + resource[1].trim()).replace(/\/+/g, '/');
		
		if(routePath != '/'){
			routePath = routePath.replace(/\/+$/, '');//only trim trailing slash if not `/`
		}	
		
		var verbs = ['all','get','post','put','head','delete','options',
		'trace','copy','lock','mkcol','move','purge','propfind','proppatch',
		'unlock','report','mkactivity','checkout','merge','m-search',
		'notify','subscribe','unsubscribe','patch','search','connect'];
		
		if(verbs.indexOf(verb) == -1){
			throw new Error('`express-map` encountered an invalid http verb `'+verb.toUpperCase()+'`.');
		}
		
		var handlers = object[prop];
		
		if(typeof handlers != 'string'){
			var msg = '`express-map` encountered an invalid handler format `'+handlers+'`.\n'+
			'please define your controllers in the form of <module>.<function> or just <module> if module is a function, and seperate them by a comma';
			
			throw new Error(msg);
		}else{
			
			if(handlers.indexOf(',') >=0){
				handlers = handlers.split(',');
			}else{
				handlers = [handlers];
			}
			var _self = this;
			
			var strHandlers = [];//for the logger output
			
			handlers = handlers.map(function(v){

				if(v.indexOf('.') > 0){
					v = v.split('.');	
				}else{
					v = [v];
				}
				
				if(!controllers.hasOwnProperty(v[0])){
					controllers[v[0]] = require(path +v[0]);
				}
				
				//technically we could use `eval('h = '+strH+';');` but that seems like a dirtier way to handle both concerns.
				h = controllers;
				var strH = '';
				
				for(var i=0;i<v.length;i++){
					h = h[v[i]]; //recursively point to the subsequent child until we reach the function.
					strH += '.'+v[i];
				}

				if(typeof h !='function'){
					throw new Error('`express-map` `'+h+'` does not resolve to a function and is not a valid handler for route `'+routePath+'`');
				}
				strHandlers.push(strH);
				return h;//h should now point directly to each handler function, regardless of depth.
				
			});
			
			handlers.unshift(routePath);//add the routePath. wanted to do it with spread operator but guess that isn't supported yet. bummer
			
			this[verb].apply(this,handlers);//call the associated express method with args
			
		}
		
	}	
};

module.exports = function(app){
	
	app.map = Map.bind(app);//bind express app as `this` context.
	var oldListener = app.listen;
	
	//cleanup controllers once the app starts.
	app.listen = function(){
		controllers = null;
		delete global.controllers;
		app.listen = oldListener;
		app.listen.apply(app,arguments);
	};
	
};

