function loginButtonClicked(){
    loginForm = document.getElementById('login-form');
    loginForm.submit();    
}

function logoutButtonClicked(){
    document.location.href="/user/logout";
}