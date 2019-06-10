function emptyCheckStr(string){
    if( string.replace(/(\s*)/,'').length == 0){
        return false;
    }else{
        return true;
    }
}
/**
 * Disables all input controls and buttons on the page
 */
function disableControls() {
    $('#register').attr('disabled','');
    $('#authenticate').attr('disabled','');
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

function registerButtonClicked(){
    //
    let userName = $("input[name='userName']").val();
    if(!emptyCheckStr(userName)){
        $('#status').text('Input user name first');
        $('#status').removeClass('hidden');
        return;
    }

    let displayName = $("input[name='userDisplayName']").val();
    if(!emptyCheckStr(displayName)){
        $('#status').text('Input user display name first');
        $('#status').removeClass('hidden');
    }
    $("#registerSpinner").removeClass('hidden');
    disableControls();

    // authenticator selection criteria
    let specifyAuthenticatorSelection = $("input[name='specifyAuthenticatorSelection']").is(':checked');
    let specifyAuthenticatorAttachment = $("input[name='specifyAuthenticatorAttachment']").is(':checked');
    let attachment = $("input[name='attachment']:checked").val();   // optional
    let requireResidentKey = $("input[name='requireResidentKey']").is(':checked');  // default to false
    let userVerification = $("input[name='userVerificationRequired']:checked").val();
    // attestation conveyance preference
    let specifyAttestationConvenyance = $("input[name='specifyAttestationConveyance']").is(':checked');
    let attestation = $("input[name='attestationConveyancePreference']:checked").val(); // default to none

    let serverPublicKeyCredentialCreationOptionsRequest = {
        username: userName,
        displayName: displayName
    };
    // set authenticator selection criteria
    console.log(specifyAuthenticatorSelection);
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
    
    $("#registerSpinner").addClass('hidden');
    $('#status').html('<pre>'+JSON.stringify(serverPublicKeyCredentialCreationOptionsRequest, null, 2)+'</pre>');
    enableControls();
    
    console.log(JSON.stringify(serverPublicKeyCredentialCreationOptionsRequest, null, 2));
}