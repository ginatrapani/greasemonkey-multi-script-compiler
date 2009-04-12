function {$data.shortname}_PrefManager() {$smarty.ldelim}
	var startPoint="{$data.shortname}.pref.";

	var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService).
		getBranch(startPoint);

	var observers={$smarty.ldelim}};

	// whether a preference exists
	this.exists=function(prefName) {$smarty.ldelim}
		return pref.getPrefType(prefName) != 0;
	}

	// returns the named preference, or defaultValue if it does not exist
	this.getValue=function(prefName, defaultValue) {$smarty.ldelim}
		var prefType=pref.getPrefType(prefName);

		// underlying preferences object throws an exception if pref doesn't exist
		if (prefType==pref.PREF_INVALID) {$smarty.ldelim}
			return defaultValue;
		}

		switch (prefType) {$smarty.ldelim}
			case pref.PREF_STRING: return pref.getCharPref(prefName);
			case pref.PREF_BOOL: return pref.getBoolPref(prefName);
			case pref.PREF_INT: return pref.getIntPref(prefName);
			default: return defaultValue;
		}
		
	}

	// sets the named preference to the specified value. values must be strings,
	// booleans, or integers.
	this.setValue=function(prefName, value) {$smarty.ldelim}
		var prefType=typeof(value);

		switch (prefType) {$smarty.ldelim}
			case "string":
			case "boolean":
				break;
			case "number":
				if (value % 1 != 0) {$smarty.ldelim}
					throw new Error("Cannot set preference to non integral number");
				}
				break;
			default:
				throw new Error("Cannot set preference with datatype: " + prefType);
		}

		// underlying preferences object throws an exception if new pref has a
		// different type than old one. i think we should not do this, so delete
		// old pref first if this is the case.
		if (this.exists(prefName) && prefType != typeof(this.getValue(prefName))) {$smarty.ldelim}
			this.remove(prefName);
		}

		// set new value using correct method
		switch (prefType) {$smarty.ldelim}
			case "string": pref.setCharPref(prefName, value); break;
			case "boolean": pref.setBoolPref(prefName, value); break;
			case "number": pref.setIntPref(prefName, Math.floor(value)); break;
		}
	}

	// deletes the named preference or subtree
	this.remove=function(prefName) {$smarty.ldelim}
		pref.deleteBranch(prefName);
	}

	// call a function whenever the named preference subtree changes
	this.watch=function(prefName, watcher) {$smarty.ldelim}
		// construct an observer
		var observer={$smarty.ldelim}
			observe:function(subject, topic, prefName) {$smarty.ldelim}
				watcher(prefName);
			}
		};

		// store the observer in case we need to remove it later
		observers[watcher]=observer;

		pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal).
			addObserver(prefName, observer, false);
	}

	// stop watching
	this.unwatch=function(prefName, watcher) {$smarty.ldelim}
		if (observers[watcher]) {$smarty.ldelim}
			pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal)
				.removeObserver(prefName, observers[watcher]);
		}
	}
}