function registerButtonClicked(){
    qrcode = document.getElementById('qrcodeStr').value;

    document.location.href="qrcode/generate/"+qrcode;
}