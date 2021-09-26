import $ from 'jquery';
$(function () {
    $('.services__entry a').click(function (e) {
        e.preventDefault();

        let $modalContent = $('.modal__content');

        let $this = $(this);

        let content = $this.next('.entry__content').html();

        $modalContent.html(content)
        $('.modal').addClass('opened');
        $('html').addClass('modal-opened');

    });

    $('.modal__close').click(function (e) {
        e.preventDefault();

        $('.modal').removeClass('opened');
        $('html').removeClass('modal-opened');

        $('.modal__content').html('');
    });
})