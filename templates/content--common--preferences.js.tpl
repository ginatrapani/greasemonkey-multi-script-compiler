var {$data.shortname}_preferencesService = null;

// Deletes a preference
function {$data.shortname}_deletePreference(preference) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
        // If a user preference is set
        if({$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
            {$data.shortname}_getPreferencesService().clearUserPref(preference);
        }
    }
}

// Deletes a preference branch
function {$data.shortname}_deletePreferenceBranch(branch) {$smarty.ldelim}
    // If the branch is set
    if(branch) {$smarty.ldelim}
        {$data.shortname}_getPreferencesService().deleteBranch(branch);
    }
}

// Gets a boolean preference, returning false if the preference is not set
function {$data.shortname}_getBooleanPreference(preference, userPreference) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
        // If not a user preference or a user preference is set
        if(!userPreference || {$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
            try {$smarty.ldelim}
                return {$data.shortname}_getPreferencesService().getBoolPref(preference);
            } catch(exception) {$smarty.ldelim}
                // Do nothing
            }
        }
    }
    
    return false;
}

// Gets an integer preference, returning 0 if the preference is not set
function {$data.shortname}_getIntegerPreference(preference, userPreference) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
        // If not a user preference or a user preference is set
        if(!userPreference || {$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
            try {$smarty.ldelim}
                return {$data.shortname}_getPreferencesService().getIntPref(preference);
            } catch(exception) {$smarty.ldelim}
                // Do nothing
            }
        }
    }
    
    return 0;
}

// Gets the preferences service
function {$data.shortname}_getPreferencesService() {$smarty.ldelim}
    // If the preferences service is not set
    if(!{$data.shortname}_preferencesService) {$smarty.ldelim}
        {$data.shortname}_preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
    }
    
    return {$data.shortname}_preferencesService;
}

// Gets a string preference, returning null if the preference is not set
function {$data.shortname}_getStringPreference(preference, userPreference) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
    
        // If not a user preference or a user preference is set
        if(!userPreference || {$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
            try {$smarty.ldelim}
            
                return {$data.shortname}_getPreferencesService().getComplexValue(preference, Components.interfaces.nsISupportsString).data;
            } catch(exception) {$smarty.ldelim}
                // Do nothing
                //alert(exception);
            }
        }
    }
    
    return null;
}

// Is a preference set
function {$data.shortname}_isPreferenceSet(preference) {$smarty.ldelim}

    // If the preference is set
    if(preference) {$smarty.ldelim}
        return {$data.shortname}_getPreferencesService().prefHasUserValue(preference);
    }
    
    return false;
}

// Sets a boolean preference
function {$data.shortname}_setBooleanPreference(preference, value) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
        {$data.shortname}_getPreferencesService().setBoolPref(preference, value);
    }
}

// Sets a boolean preference if it is not already set
function {$data.shortname}_setBooleanPreferenceIfNotSet(preference, value) {$smarty.ldelim}
    // If the preference is not set
    if(!{$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
        {$data.shortname}_getPreferencesService().setBoolPref(preference, value);
    }
}

// Sets an integer preference
function {$data.shortname}_setIntegerPreference(preference, value) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
        {$data.shortname}_getPreferencesService().setIntPref(preference, value);
    }
}

// Sets an integer preference if it is not already set
function {$data.shortname}_setIntegerPreferenceIfNotSet(preference, value) {$smarty.ldelim}
    // If the preference is not set
    if(!{$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
        {$data.shortname}_setIntegerPreference(preference, value);
    }
}

// Sets a string preference
function {$data.shortname}_setStringPreference(preference, value) {$smarty.ldelim}
    // If the preference is set
    if(preference) {$smarty.ldelim}
        var supportsStringInterface = Components.interfaces.nsISupportsString;
        var string                  = Components.classes["@mozilla.org/supports-string;1"].createInstance(supportsStringInterface);
        
        string.data = value;
        
        {$data.shortname}_getPreferencesService().setComplexValue(preference, supportsStringInterface, string);
    }
}

// Sets a string preference if it is not already set
function {$data.shortname}_setStringPreferenceIfNotSet(preference, value) {$smarty.ldelim}
    // If the preference is not set
    if(!{$data.shortname}_isPreferenceSet(preference)) {$smarty.ldelim}
        {$data.shortname}_setStringPreference(preference, value);
    }
}

function {$data.shortname}_setStringPreferenceWithForce(preference, value, force) {$smarty.ldelim}
	if (force) {$smarty.ldelim}
		{$data.shortname}_setStringPreference(preference, value);
	} else {$smarty.ldelim}
		{$data.shortname}_setStringPreferenceIfNotSet(preference, value); 
	}
}

function {$data.shortname}_setIntegerPreferenceWithForce(preference, value, force) {$smarty.ldelim}
	if (force) {$smarty.ldelim}
		{$data.shortname}_setIntegerPreference(preference, value);
	} else {$smarty.ldelim}
		{$data.shortname}_setIntegerPreferenceIfNotSet(preference, value); 
	}
}

function {$data.shortname}_setBooleanPreferenceWithForce(preference, value, force) {$smarty.ldelim}
	if (force) {$smarty.ldelim}
		{$data.shortname}_setBooleanPreference(preference, value);
	} else {$smarty.ldelim}
		{$data.shortname}_setBooleanPreferenceIfNotSet(preference, value); 
	}
}