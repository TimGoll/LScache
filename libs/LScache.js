//parameter variables (global)
	//compression type
	var DISABLE       = 0;
	var DEFAULT       = 1;
	var COMPATIBILITY = 2;

var LScache = (function() {
	var LScache = {
		init : function({compression_type} = {}) {
			_compression_type = compression_type || DISABLE;

			//add event for storage change
			window.addEventListener('storage', _on_storage_change, false);

			//after initialization, the cash is loaded
			return handle_expire_on_load();
		},

		addEventListener : function(type, functionPointer) {
			if (type.toLowerCase() == "changed")
				_callbackfunction_changed = functionPointer;
			else if (type.toLowerCase() == "added")
				_callbackfunction_added = functionPointer;
			else if (type.toLowerCase() == "removed")
				_callbackfunction_removed = functionPointer;
			else if (type.toLowerCase() == "expired")
				_callbackfunction_expired = functionPointer;
			else
				return false;
			return true;
		},

		removeEventListener : function(type) {
			if (type.toLowerCase() == "changed")
				_callbackfunction_changed = undefined;
			else if (type.toLowerCase() == "added")
				_callbackfunction_added = undefined;
			else if (type.toLowerCase() == "removed")
				_callbackfunction_removed = undefined;
			else if (type.toLowerCase() == "expired")
				_callbackfunction_expired = undefined;
			else
				return false;
			return true;
		},

		add : function(objectname_v, object_v, {expiretime} = {}) {
			//false, if parameters not given
			if (objectname_v == '' || objectname_v == undefined || object_v == undefined)
				return false;

			//false, if objectname is already given
			if (window.localStorage[objectname_v] != undefined)
				return false;

			//try to store
			try {
				if (expiretime == undefined || expiretime == 0) {
					window.localStorage[objectname_v] = JSON.stringify({obj: object_v, exp: 0});
				} else {
					window.localStorage[objectname_v] = JSON.stringify({obj: object_v, exp: new Date().getTime() + expiretime});
					_set_expire_event(objectname_v, new Date().getTime() + expiretime);
				}
			} catch (e) {
		        //error occured, update of storage failed
				console.log("[LScache] update of storage failed.");
				return false;
		    }

			return true;
		},

		update : function (objectname_v, object_v, {expiretime} = {}) {
			//false, if objectname is not given
			if (window.localStorage[objectname_v] == undefined)
				return false;

			//if no new expiredate is set, use the old one
			if (expiretime == undefined)
				expiretime = LScache.get_expiretime(objectname_v);

			//try to store
			try {
				if (expiretime == undefined || expiretime == false) {
					window.localStorage[objectname_v] = JSON.stringify({obj: object_v, exp: 0});
				} else {
					//remove expire event if defined
					if (_expire_events[objectname_v] != undefined) {
						clearTimeout(_expire_events[objectname_v]);
						delete _expire_events[objectname_v];
					}
					window.localStorage[objectname_v] = JSON.stringify({obj: object_v, exp: new Date().getTime() + expiretime});
					_set_expire_event(objectname_v, new Date().getTime() + expiretime);
				}
			} catch (e) {
		        //error occured, update of storage failed
				console.log("[LScache] update of storage failed.");
				return false;
		    }

			return true;
		},

		get : function(objectname_v) {
			//false, if objectname is not given
			if (window.localStorage[objectname_v] == undefined)
				return false;
			var obj = JSON.parse(window.localStorage[objectname_v]);

			//false, if expired and "creation tab" is closed
			if (new Date().getTime() >= obj.exp && obj.exp != 0)
				return false;

			return obj.obj;
		},

		convert_to_base64_from_path : function(objectname, path, callback, {expiretime} = {}) {
			var starttime = new Date().getTime();
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				var reader = new FileReader();
				reader.onloadend = function() {
					var result = "";
					if (_compression_type == DISABLE)
						result = reader.result;
					if (_compression_type == DEFAULT)
						result = LZString.compress(reader.result);
					if (_compression_type == COMPATIBILITY)
						result = LZString.compressToUTF16(reader.result);

					//result
					callback(objectname, result, {expiretime: expiretime});
				}
				reader.readAsDataURL(xhr.response);
			};
			xhr.open('GET', path);
			xhr.responseType = 'blob';
			xhr.send();
		},

		uncompress_image : function(compressed_string) {
			var result = "";
			if (_compression_type == DISABLE)
				result = compressed_string;
			if (_compression_type == DEFAULT)
				result = LZString.decompress(compressed_string);
			if (_compression_type == COMPATIBILITY)
				result = LZString.decompressToUTF16(compressed_string);

			return result;
		},

		remove : function(objectname_v) {
			//false, if objectname is not given
			if (window.localStorage[objectname_v] == undefined)
				return false;

			//remove expire event if defined
			if (_expire_events[objectname_v] != undefined) {
				clearTimeout(_expire_events[objectname_v]);
				delete _expire_events[objectname_v];
			}

			window.localStorage.removeItem(objectname_v);

			return true;
		},

		remove_all : function() {
			window.localStorage.clear();
			return true;
		},

		get_expiretime : function(objectname_v) {
			//false, if objectname is not given
			if (window.localStorage[objectname_v] == undefined)
				return false;

			var obj = JSON.parse(window.localStorage[objectname_v]);

			//exp not defined
			if (obj.exp == undefined)
				return false;

			//expires never
			if (obj.exp == 0)
				return false;

			return obj.exp - new Date().getTime();
		},

		update_expiretime : function(objectname_v, {expiretime} = {}) {
			//false, if objectname is not given
			if (window.localStorage[objectname_v] == undefined)
				return false;

			var obj = JSON.parse(window.localStorage[objectname_v]);

			return LScache.update(objectname_v, obj.obj, expiretime);
		},

		//returns size currently used in localStorage
		get_size : function() {
			var length = 0;

			var list = LScache.get_stored_list();
			for (var id in list)
				length += window.localStorage[list[id]].length;

			return length;
		},

		get_stored_list : function() {
			if (window.localStorage.length === 0)
				return [];
			return Object.keys(window.localStorage);
		}
	};

	var _on_storage_change = function(event) {
		var _key = event.key;
		var _new = event.newValue;
		var _old = event.oldValue;

		if (_new == null && _old != null) {
			var obj = JSON.parse(_old);
			if (obj.exp == 0 || new Date().getTime() < obj.exp) {
				if (_callbackfunction_removed != undefined)
					_callbackfunction_removed({key: _key, obj: obj.obj});
				console.log("[LScache] Object removed: localStorage['" + _key + "']");
			} else {
				if (_callbackfunction_expired != undefined)
					_callbackfunction_expired({key: _key, obj: obj.obj});
				console.log("[LScache] Object expired: localStorage['" + _key + "']");
			}
		}
		if (_old == null && _new != null) {
			if (_callbackfunction_added != undefined)
				_callbackfunction_added({key: _key, obj: JSON.parse(_new).obj});
			console.log("[LScache] Object added: localStorage['" + _key + "']");
		}
		if (_old != null && _new != null) {
			if (_callbackfunction_changed != undefined)
				_callbackfunction_changed({key: _key, obj: JSON.parse(_old).obj});
			console.log("[LScache] Object changed: localStorage['" + _key + "']");
		}
	};

	var handle_expire_on_load = function() {
		var storage_list = LScache.get_stored_list();
		if (storage_list.length == 0)
			return true;

		for (var id in storage_list) {
			try {
				var obj = JSON.parse(window.localStorage[storage_list[id]]);

				if (obj.exp != undefined && obj.exp != 0)
					//handle expire between pagevisits
					if (new Date().getTime() >= obj.exp)
						window.localStorage.removeItem(storage_list[id]);
					else
						_set_expire_event(storage_list[id], obj.exp);
			} catch(e) {
				console.log("[LScache] JSON parsing of object failed: localStorage['" + storage_list[id] + "']: " + window.localStorage[storage_list[id]]);
			}
		}

		return true;
	};

	var _set_expire_event = function(objectname_v, expiretime) {
		_expire_events[objectname_v] = window.setTimeout(function() {
			if (_callbackfunction_changed != undefined)
				_callbackfunction_changed({key: objectname_v, obj: JSON.parse(window.localStorage[objectname_v]).obj});
			console.log("[LScache] Data expired: localStorage['" + objectname_v + "']");
			LScache.remove(objectname_v);
		}, expiretime - new Date().getTime() );
	}

	//these values are private
	var _compression_type = 0;
	var _expire_events = {};

	//event function list
	var _callbackfunction_added   = undefined;
	var _callbackfunction_removed = undefined;
	var _callbackfunction_changed = undefined;
	var _callbackfunction_expired = undefined;

	return LScache;
})();
