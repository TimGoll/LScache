//parameter variables (global)
	//compression type
	var NO_COMPRESSION = 0;
	var DEFAULT_COMPRESSION = 1;
	var COMPATIBILITY_COMPRESSION = 2;
	
	//enable / disable expiredate
	var NO_EXPIRE_DATE = 0;
	var EXPIRE_DATE = 1;
	
	//direct storage
	var DISABLE_DIRECT_STORAGE = 0;
	var ENABLE_DIRECT_STORAGE = 1;

var LScash = (function() {
	var LScash = {
		init : function(compression_type, enable_expiredate) {
			_compression_type = compression_type || 0;
			_enable_expiredate = enable_expiredate || 0;
			
			//after initialization, the cash is loaded
			return LScash.reload();
		},
		
		add : function(objectname, object, expiretime, enable_direct_storage) {
			enable_direct_storage = enable_direct_storage || 1; //per default, direct storage is activated
			
			//parameters not given
			if (objectname == ( '' || undefined ) || object == undefined)
				return false;
			
			//error, when objectname is already given
			if (_data[objectname] != undefined)
				return false;
			
			//expiretime
			if (expiretime == ( undefined || 0 ) )
				_data[objectname].exp = 0;
			else
				_data[objectname].exp = expiretime; //TODO calc real time 
			
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
		
		store : function() {
			
		},
		
		reload : function() {
			return true;
		}
	};
	
	//private functions
	var _storeObject = function (object) {
		
	};
	
	var _loadObject = function () {
		var compressed = localStorage.getItem("__LScash_data__");
		if (_compression_type == NO_COMPRESSION)
			return compressed;
		if (_compression_type == DEFAULT_COMPRESSION)
			return decompress(compressed);
		if (_compression_type == COMPATIBILITY_COMPRESSION)
			return decompressFromUTF16(compressed);
	};
	
	//these values are private
	var _compression_type = 0;
	var _enable_expiredate = 0;
	
	var _data = { //uncompressed data
		test: "hallo"
	};
	
	return LScash;
})();

console.log(LScash.get());