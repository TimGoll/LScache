//parameter variables (global)
	//compression type
	var DISABLE       = 0;
	var ENABLE        = 1;
	var DEFAULT       = 1;
	var COMPATIBILITY = 2;

var LScash = (function() {
	var LScash = {
		init : function({compression_type, expiredate, storagesize} = {}) {
			_compression_type = compression_type || DISABLE;
			_expiredate = expiredate || DISABLE;
			_storagesize = storagesize || 5*1024*1024; //5MB is default

			//after initialization, the cash is loaded
			return LScash.reload();
		},

		add : function(objectname_v, object_v, {expiretime, direct_storage} = {}) {
			direct_storage = direct_storage || ENABLE; //per default, direct storage is enabled

			//false, if parameters not given
			if (objectname_v == '' || objectname_v == undefined || object_v == undefined)
				return false;

			//false, if objectname is already given
			if (_data[objectname_v] != undefined)
				return false;

			//create new enty
			_data[objectname_v] = {};

			//expiretime
			if (_expiredate == ENABLE) {
				if (expiretime == undefined || expiretime == 0) {
					_data[objectname_v].exp = 0;
				} else {
					_data[objectname_v].exp = new Date().getTime() + expiretime; //calc real time in ms after 01/01/1970
					_set_expire_event(objectname_v, new Date().getTime() + expiretime);
				}
			}

			_data[objectname_v].obj = object_v;

			//if direct storage is enabled, encode and store new data
			if (direct_storage == ENABLE) {
				if (!_storeObject(JSON.stringify(_data))) {
					delete _data[objectname_v];
					return false;
				}
				return true;
			}

			return true;
		},

		update : function (objectname_v, object_v, {expiretime, direct_storage} = {}) {
			//false, if objectname is not given
			if (_data[objectname_v] == undefined)
				return false;

			//if no new expiredate is set, use the old one
			if (expiretime == undefined && _data[objectname_v].exp != undefined)
				expiretime = this.get_expiretime(objectname_v);

			this.remove(objectname_v, {direct_storage: DISABLE}); //disable because add() (next step) stores direct
			return this.add(objectname_v, object_v, {expiretime: expiretime, direct_storage: direct_storage});
		},

		get : function(objectname_v) {
			//false, if objectname is not given
			if (_data[objectname_v] == undefined)
				return false;

			//false, when data is expired
			if (_expiredate == ENABLE) {
				if (_data[objectname_v].exp != 0 && new Date().getTime() >= _data[objectname_v].exp) {
					this.remove(objectname_v, {direct_storage: ENABLE});
					return false;
				}
			}

			return _data[objectname_v].obj;
		},

		add_image : function() {

		},

		get_image : function() {

		},

		update_image : function() {

		},

		remove : function(objectname_v, {direct_storage} = {}) {
			direct_storage = direct_storage || ENABLE; //per default, direct storage is enabled

			if (_data[objectname_v] != undefined)
				delete _data[objectname_v];
			else
				return false;

			if (direct_storage == ENABLE) {
				if (!_storeObject(JSON.stringify(_data)))
					return false
				return true;
			}
			return true;
		},

		remove_all : function() {
			var list = this.get_stored_list();
			for (var id in list)
				this.remove(list[id], {direct_storage: DISABLE});
			this.store();
			return true;
		},

		get_expiretime : function(objectname_v) {
			//false, if objectname is not given
			if (_data[objectname_v] == undefined)
				return false;

			//expires never
			if (_data[objectname_v].exp == 0)
				return false;

			return _data[objectname_v].exp - new Date().getTime();
		},

		update_expiretime : function(objectname_v, {expiretime, direct_storage} = {}) {
			direct_storage = direct_storage || ENABLE; //per default, direct storage is enabled

			//false, if objectname is not given
			if (_data[objectname_v] == undefined)
				return false;

			//expiretime
			if (_expiredate == ENABLE) {
				if (expiretime == undefined || expiretime == 0) {
					_data[objectname_v].exp = 0;
				} else {
					_data[objectname_v].exp = new Date().getTime() + expiretime; //calc real time in ms after 01/01/1970
					_set_expire_event(objectname_v, new Date().getTime() + expiretime);
				}
			}

			if (direct_storage == ENABLE) {
				if (!_storeObject(JSON.stringify(_data)))
					return false
				return true;
			}
			return true;
		},

		store : function() {
			return _storeObject(JSON.stringify(_data));
		},

		reload : function() {
			_loadObject();

			_data = JSON.parse(_data_string);

			//for security: ignore if expire is enabled
			var list = this.get_stored_list();
			for (var id in list) {
				if (_data[list[id]].exp != undefined && _data[list[id]].exp != 0)
					_set_expire_event(list[id], _data[list[id]].exp);
			}

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
		_data_string = localStorage.getItem("__LScash_data__");

		if (compressed = undefined)
			return "";

		if (_compression_type == DISABLE)
			return compressed;
		if (_compression_type == DEFAULT)
			return decompress(compressed);
		if (_compression_type == COMPATIBILITY)
			return decompressFromUTF16(compressed);
	};

	var _set_expire_event = function(objectname_v, expiretime) {
		window.setTimeout(function() {
			//just delete, if expiretime wasn't changed
			if (_data[objectname_v] != undefined) {
				if (new Date().getTime() >= _data[objectname_v].exp && _data[objectname_v].exp != 0)
					LScash.remove(objectname_v, {direct_storage: ENABLE});
			}
		}, expiretime - new Date().getTime());
	}

	//these values are private
	var _compression_type = 0;
	var _expiredate = 0;
	var _storagesize = 0;

	var _data = { //uncompressed data

	};
	var _data_string = "";


	return LScash;
})();
