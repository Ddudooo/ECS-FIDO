function ModifiedUserButtonClicked() {
    //document.location.href="/user/login/";
    modifyForm = document.getElementById('modify-form');
    modifyForm.submit();
}

async function cancelMemberButtonClicked() {
    // registeForm = document.getElementById('registe-form');
    // registeForm.submit();  
    const { value: password } = await Swal.fire({
        title: 'Enter your password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off'
        }
        
    })

    if (password) {
        // Swal.fire('Entered password: ' + password)
        var $form = $('<form></form>');
        $form.attr('action', '/user/cancle/membership');
        $form.attr('method', 'post');        
        $form.appendTo('body');
        
        var userPw = $('<input type="hidden" value="'+password+'" name="userPw">');
    
        $form.append(userPw);
        $form.submit();
        $form.remove();
    }
}