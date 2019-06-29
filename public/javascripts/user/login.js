function loginButtonClicked(){
    loginForm = document.getElementById('login-form');
    loginForm.submit();    
}

function logoutButtonClicked(){
    document.location.href="/user/logout";
}

function RegisterButtonClicked(){
    document.location.href="/user/register";
}

function MypageButtonClicked(){
    document.location.href="/user/mypage";
}