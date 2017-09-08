var LScash = (function() {
	var LScash = {
		add : function(objectname, object, expiretime) {
			//parameters not given
			if (objectname == ( '' || undefined ) || object == undefined)
				return false;
			
			//error, when objectname is already given
			if (_data[objectname] != undefined)
				return false;
			
			//expiretime
			if (expiretime == ( undefined || 0 ) )
				_data[objectname].expire = 0;
			else
				_data[objectname].expire = expiretime;
			
			_data[objectname].obj = object;
			return true;
		},
		
		update : function () {
			//error, when objectname is not given
			if (_data[objectname] == undefined)
				return false;
			
			_data[objectname] = object;
			return true;
		},
		
		remove : function() {
			
		},
		
		get : function() {
			
		},
		
		get_and_remove : function() {
			
		},
		
		set_expire : function() {
			
		},
		
		get_expire : function() {
			
		},
		
		reload : function() {
		
		}
	};
	
	//these values are private
	var _data = { //uncompressed data
		test: "hallo"
	};
	
	//after loading the page the cash is checked
	LScash.reload();
	
	return LScash;
})();

console.log(LScash.get());