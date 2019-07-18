$().ready(function(){
    $('.concertSeat.None').css("border", "#FF0000 solid 1px");
    $('.concertSeat.None').css('cursor', 'pointer');
    $('.concertSeat.None').on("click",function(){
        $(this).find('form').submit();
    });
});