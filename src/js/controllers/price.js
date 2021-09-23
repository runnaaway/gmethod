import $ from 'jquery';
$(function () {
    $('.services__entry a').click(function (e) {
        e.preventDefault();

        let $modalContent = $('.modal__content');

        let url = $(this).data('url');


        if(url.length > 0) {
            $.ajax({
                cache: false,
                dataType: 'html',
                method: 'GET',
                url: url,
            })
            .done(function(data) {
                $(data).appendTo($modalContent);
                $modalContent.animate({
                    scrollTop: 0
                }, 0);
                $('.modal').addClass('opened');
                $('html').addClass('modal-opened');
            })
            .fail(function(jqXHR) {
                console.log('error', jqXHR);
            });
        }


    });

    $('.modal__close').click(function (e) {
        e.preventDefault();

        $('.modal').removeClass('opened');
        $('html').removeClass('modal-opened');

        $('.modal__content').html('');
    });
})