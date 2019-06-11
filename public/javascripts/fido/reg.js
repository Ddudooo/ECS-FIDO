function emptyCheckStr(string) {
    if (string.replace(/(\s*)/, '').length == 0) {
        return false;
    } else {
        return true;
    }
}
/**
 * Disables all input controls and buttons on the page
 */
function disableControls() {
    $('#register').attr('disabled', '');
    $('#authenticate').attr('disabled', '');
    $("#status").addClass('hidden');
}

/**
 * Enables all input controls and buttons on the page
 */
function enableControls() {
    $('#register').removeAttr('disabled');
    $('#authenticate').removeAttr('disabled');
    $("#status").removeClass('hidden');
}

function registerButtonClicked() {
    //
    let userName = $("input[name='userName']").val();
    if (!emptyCheckStr(userName)) {
        $('#status').text('Input user name first');
        $('#status').removeClass('hidden');
        return;
    }

    let displayName = $("input[name='userDisplayName']").val();
    if (!emptyCheckStr(displayName)) {
        $('#status').text('Input user display name first');
        $('#status').removeClass('hidden');
    }
    $("#registerSpinner").removeClass('hidden');
    disableControls();

    // authenticator selection criteria
    let specifyAuthenticatorSelection = $("input[name='specifyAuthenticatorSelection']").is(':checked');
    let specifyAuthenticatorAttachment = $("input[name='specifyAuthenticatorAttachment']").is(':checked');
    let attachment = $("input[name='attachment']:checked").val(); // optional
    let requireResidentKey = $("input[name='requireResidentKey']").is(':checked'); // default to false
    let userVerification = $("input[name='userVerificationRequired']:checked").val();
    // attestation conveyance preference
    let specifyAttestationConvenyance = $("input[name='specifyAttestationConveyance']").is(':checked');
    let attestation = $("input[name='attestationConveyancePreference']:checked").val(); // default to none

    let serverPublicKeyCredentialCreationOptionsRequest = {
        username: userName,
        displayName: displayName
    };
    // set authenticator selection criteria
    
    if (specifyAuthenticatorSelection) {
        let authenticatorSelection = {
            requireResidentKey: requireResidentKey,
            userVerification: userVerification
        };
        // set authenticator attachment
        if (specifyAuthenticatorAttachment) {
            authenticatorSelection.authenticatorAttachment = attachment;
        }
        serverPublicKeyCredentialCreationOptionsRequest.authenticatorSelection = authenticatorSelection;
    }

    // set attestation conveyance preference
    if (specifyAttestationConvenyance) {
        serverPublicKeyCredentialCreationOptionsRequest.attestation = attestation;
    }




    
    $('#status').html('<pre>' + JSON.stringify(serverPublicKeyCredentialCreationOptionsRequest, null, 4) + '</pre>');
    

    console.log(JSON.stringify(serverPublicKeyCredentialCreationOptionsRequest, null, 4));

    getRegChallenge(serverPublicKeyCredentialCreationOptionsRequest)
        .then(response => {
            return response;
        })
        .then((jsonData) => {
            $('#status').html('<pre>'+JSON.stringify(jsonData, null, 4)+'</pre>');
            console.log(JSON.stringify(jsonData, null, 4));
            $("#registerSpinner").addClass('hidden');
            enableControls();
        })
        .catch( e => {
            $('#status').text("Error : "+ e);
            $("#registerSpinner").addClass("hidden");
            enableControls();
        })

}

function getRegChallenge(serverPublicKeyCredentialCreationOptionsRequest){
    return rest_post("/fido/reg/challenge",serverPublicKeyCredentialCreationOptionsRequest)
        .then(response => {
            if(response.status !== 'ok'){
                return Promise.reject(response.errorMessage);
            } else{
                return Promise.resolve(response);
            }
        })

}
/**
 * Performs an HTTP get operation
 * @param {string} endpoint endpoint URL
 * @returns {Promise} Promise resolving to javascript object received back
 */
function rest_get(endpoint) {
    return fetch(endpoint, {
            method: "GET",
            credentials: "same-origin"
        })
        .then(response => {
            return response.json();
        });
}

/**
 * Performs an HTTP POST operation
 * @param {string} endpoint endpoint URL
 * @param {any} object
 * @returns {Promise} Promise resolving to javascript object received back
 */
function rest_post(endpoint, object) {
    return fetch(endpoint, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(object),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => {
            return response.json();
        });
}

/**
 * Performs an HTTP put operation
 * @param {string} endpoint endpoint URL
 * @param {any} object
 * @returns {Promise} Promise resolving to javascript object received back
 */
function rest_put(endpoint, object) {
    return fetch(endpoint, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(object),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => {
            return response.json();
        });
}