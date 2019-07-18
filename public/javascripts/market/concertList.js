$().ready(function(){
    $('.concert_info').css('cursor', 'pointer');
    $('.concert_info').css('border', '#FF0000 solid 1px');
    $('.concert_info').css('padding', '15px 5px');
    $('.concert_info').on('click',function(){
        console.log("test");
        $(this).find('form').submit();
    })
});