//parameter variables (global)
	//compression type
	var DISABLE       = 0;
	var ENABLE        = 1;
	var DEFAULT       = 1;
	var COMPATIBILITY = 2;

var LScash = (function() {
	var LScash = {
		init : function(compression_type, expiredate, storagesize) {
			_compression_type = compression_type || DISABLE;
			_expiredate = expiredate || DISABLE;
			_storagesize = storagesize || 5*1024*1024; //5MB is default

			//after initialization, the cash is loaded
			return LScash.reload();
		},

		add : function(objectname_v, object_v, expiretime_v, direct_storage) {
			direct_storage = direct_storage || ENABLE; //per default, direct storage is enabled

			//parameters not given
			if (objectname_v == ( '' || undefined ) || object_v == undefined)
				return false;

			//error, when objectname is already given
			if (_data[objectname_v] != undefined)
				return false;

			//expiretime
			if (expiretime_v == ( undefined || 0 ) )
				_data[objectname_v].exp = 0;
			else
				_data[objectname_v].exp = new Date().getTime() + expiretime_v; //calc real time in ms after 01/01/1970

			_data[objectname_v].obj = object_v;

			//if direct storage is enabled, encode and store new data
			if (direct_storage == ENABLE) {
				return _storeObject(JSON.stringify(_data));
			}

			return true;
		},

		update : function (objectname_v) {
			//error, when objectname is not given
			if (_data[objectname_v] == undefined)
				return false;

			_data[objectname] = object;
			return true;
		},

		remove : function() {

		},

		add_image : function() {

		},

		get_image : function() {

		},

		update_image : function() {

		},

		get : function() {

		},

		set_expire : function() {

		},

		get_expire : function() {

		},

		store : function() {
			return _storeObject(JSON.stringify(_data));
		},

		reload : function() {
			return true;
		},

		//returns size currently used in localStorage
		get_size : function() {
			return _data_string.length;
		},

		get_stored_list : function() {
			return Object.keys(_data);
		}
	};

	//private functions
	var _storeObject = function (object_string) {
		var compressed = "";

		if (_compression_type == DISABLE)
			compressed = object_string;
		if (_compression_type == DEFAULT)
			compressed = compress(object_string);
		if (_compression_type == COMPATIBILITY)
			compressed = compressFromUTF16(object_string);

		//store data in localStorage
		if (compressed.length <= _storagesize) {
			localStorage.setItem("__LScash_data__", compressed);
			return true;
		}

		return false;
	};

	//returns JSON string of stored object
	var _loadObject = function () {
		var compressed = localStorage.getItem("__LScash_data__");

		if (compressed = undefined)
			return "";

		if (_compression_type == DISABLE)
			return compressed;
		if (_compression_type == DEFAULT)
			return decompress(compressed);
		if (_compression_type == COMPATIBILITY)
			return decompressFromUTF16(compressed);
	};

	//these values are private
	var _compression_type = 0;
	var _expiredate = 0;
	var _storagesize = 0;

	var _data = { //uncompressed data
		test: "hallo"
	};
	var _data_string = "";


	return LScash;
})();
