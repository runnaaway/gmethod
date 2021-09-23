// import $ from 'jquery';
import 'slick-carousel';
import '../scss/main.scss';
import '../tpl/pages/index/index.pug';

import './controllers/price';
import './controllers/animations';
import 'lightbox2';


import GG, {ggPopup, ggResponsive, ggFormsController } from 'ggcore';

const init = {
    config: {
        log: true
    },
};

GG.use(
    init,
    ggPopup,
    ggResponsive,
    ggFormsController
);

window.GG = GG;

GG.responsive = true;

$(function () {
    setFixedHeader();
    $(window).scroll(function () {
        setFixedHeader();
    });

    $('.round_bg').parallax("0", 0.6);

    $('.equipment__list').slick({
        slidesToShow: 7,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 13000,
        rows: 0,
        arrows: false,
        cssEase: 'linear',
        slidesToScroll: 1,
        variableWidth: true,
    });

    if($(window).width() < 1000) {
        let $btn = $('.about .btn');
        $('.about .btn').detach();
        $btn.insertAfter('.about__container');
    }

    $('body').on('click', '.js-header-toggle', function (e) {
        e.preventDefault();

        $('.header-desk').toggle();
    });

    $('.reviews__list').slick({
        slidesToShow: 1,
        rows: 0,
        prevArrow: $('.reviews__arr_prev'),
        nextArrow: $('.reviews__arr_next'),
        dots: true,
        slidesToScroll: 1,
        adaptiveHeight: true,
        center: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    centerMode: false,
                    adaptiveHeight: false
                }
            },
            {
                breakpoint: 400,
                settings: {
                    centerMode: false,
                    adaptiveHeight: true,
                    dots: false
                }
            },
        ]
    });

    $(window).scroll(function () {
        if($(window).scrollTop() > 300) {
            $('.totop').addClass('vis')
        } else {
            $('.totop').removeClass('vis')
        }
    });

    $('.totop').click(function (e) {
        e.preventDefault();

        $('html, body').animate({scrollTop: 0})
    });

    $('.form input, .form textarea').blur(function () {
        if($(this).val() !== '') {
            $(this).addClass('filled')
        } else {
            $(this).removeClass('filled')
        }
    })


    if (typeof ymaps != 'undefined') {
        ymaps.ready(YMapsInit);
    }

    $('.form__label_file input').change(function (e) {
        if($(this)[0].files[0].size > 5242800) {
            alert('Размер файла превышает допустимые 5Мб. Пожалуйста, загрузите другой файл');
            $(this).val('');
            $('.file__container span').text('Кликните для загрузки');
        } else {
            $('.file__container span').text('Файл загружен: ' + $(this)[0].files[0].name)
        }
    });

    $('body').on('click', '.js-callback',function (e) {
        e.preventDefault();

        GG.togglePopup('popup-callback');
    });

    $('.form').formsController({
        validationSuccess: function() {
            let $form = $this;
            let action = $form.data('url');
            let data = new FormData($('.form')[0]);
            data.append('name', $form.find('input[name="name"]').val());
            data.append('name', $form.find('input[name="email"]').val());
            data.append('name', $form.find('input[name="phone"]').val());
            data.append('name', $form.find('input[name="message"]').val());
            data.append('name', $form.find('input[name="doc"]').val());
            data.append('name', $form.find('input[name="connect"]').val());
            let $loading = $form.find('.loading');

            $loading.show();


            $.ajax({
                cache: false,
                dataType: 'json',
                method: 'POST',
                url: action,
                data: data,
                success: function(response) {
                    $loading.hide();
                    if (response.success) {
                        $form.find('.form__error').hide();
                        GG.togglePopup('popup-thanks');
                    } else {
                        let message = response.error || 'Unknown error';
                        $form.find('.form__error').html(message).show();
                    }
                },
                error: function(response) {
                    $loading.hide();
                    $form
                        .find('.form__error')
                        .html('Unknown error')
                        .show();
                }
            });
        }
    });

    $('#popup-callback .formsController').formsController({
        validationSuccess: function() {
            let $form = $this;
            let action = $form.data('url');
            let data = new FormData($('#popup-callback .formsController')[0]);
            data.append('name', $form.find('input[name="name"]').val());
            data.append('name', $form.find('input[name="email"]').val());
            data.append('name', $form.find('input[name="phone"]').val());
            data.append('name', $form.find('input[name="message"]').val());
            data.append('name', $form.find('input[name="doc"]').val());
            data.append('name', $form.find('input[name="connect"]').val());
            let $loading = $form.find('.loading');

            $loading.show();


            $.ajax({
                cache: false,
                dataType: 'json',
                method: 'POST',
                url: action,
                data: data,
                success: function(response) {
                    $loading.hide();
                    if (response.success) {
                        $form.find('.form__error').hide();
                        GG.togglePopup('popup-callback');
                        GG.togglePopup('popup-thanks');
                    } else {
                        let message = response.error || 'Unknown error';
                        $form.find('.form__error').html(message).show();
                    }
                },
                error: function(response) {
                    $loading.hide();
                    $form
                        .find('.form__error')
                        .html('Unknown error')
                        .show();
                }
            });
        }
    });

    $('.js-scrollto-gallery').click(function (e) {
        e.preventDefault();

        $('html, body').animate({scrollTop: $('.works').offset().top - 70})
    });

    $(document).on('scroll', onScroll);

    $('.header__menu .menu__lnk, .footer__menu .menu__lnk').on('click', function(e) {
        e.preventDefault();
        $(document).off('scroll');

        if ($(window).width() < 768) {
            $('.header-desk').toggle();
        }

        $('.header__menu .menu__lnk').removeClass('active');
        $(this).addClass('active');

        let target = this.hash;
        let $target = $(target);
        $('html, body')
            .animate(
                {
                    scrollTop: $target.offset().top - 60
                },
                500,
                function() {
                    // window.location.hash = target;
                    $(document).on('scroll', onScroll);
                }
            );
    });

    function onScroll(event) {
        let scrollPos = $(document).scrollTop();
        $('.header__menu .menu__lnk').each(function() {
            let currLink = $(this);
            let refElement = $(currLink.attr('href'));
            if (refElement.position().top - 200 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.header__menu .menu__lnk').removeClass('active');
                currLink.addClass('active');
            } else {
                currLink.removeClass('active');
            }
        });
    }

    if(GG.config.responsive) {
        $('.why-show-more').click(function (e) {
            e.preventDefault();
            
            $(this).prev('.why__list').toggleClass('vis');
            $(this).html($(this).text() === 'Показать ещё' ? 'Скрыть' : 'Показать ещё')
        });
        
        $('.works__lnk').each(function () {
            $(this).detach();
            $(this).appendTo('.works__list');
        });

        $('.works__entry').each(function () {
            $(this).remove();
        });

        $('.works__list').slick({
            slidesToShow: 1,
            rows: 0,
            arrows: true,
            dots: true,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 400,
                    settings: {
                        dots: false,
                        arrows: false
                    }
                }
            ]
        });
    } else {
        $('.works__list').slick({
            slidesToShow: 1,
            rows: 0,
            arrows: true,
            dots: true,
            slidesToScroll: 1,
        });
    }
});

var contactsMap, contactsPlacemark;
function YMapsInit() {
    contactsMap = new ymaps.Map('contacts-map', {
        center: [60.061201, 30.290212],
        zoom: 16
    });

    contactsPlacemark = new ymaps.Placemark([60.061201, 30.290212], {
        hintContent: ''
    }, {
        iconImageHref: '/k/images/pin.svg',
        iconLayout: 'default#image',
        iconImageSize: [71, 72],
        iconImageOffset: [-20, -72]
    });

    if ($(window).width() < 767) {
        contactsMap.behaviors.disable('scrollZoom');
        contactsMap.behaviors.disable('drag');
    }

    contactsMap.geoObjects.add(contactsPlacemark);

}

function setFixedHeader() {
    if($(window).scrollTop() > 0) {
        $('.header').addClass('scroll')
    } else {
        $('.header').removeClass('scroll')
    }
}


var $window = $(window);
var windowHeight = $window.height();

$window.resize(function () {
    windowHeight = $window.height();
});

$.fn.parallax = function(xpos, speedFactor, outerHeight) {
    var $this = $(this);
    var getHeight;
    var firstTop;
    var paddingTop = 0;

    //get the starting position of each element to have parallax applied to it
    $this.each(function(){
        firstTop = $this.offset().top;
    });

    if (outerHeight) {
        getHeight = function(jqo) {
            return jqo.outerHeight(true);
        };
    } else {
        getHeight = function(jqo) {
            return jqo.height();
        };
    }

    // setup defaults if arguments aren't specified
    if (arguments.length < 1 || xpos === null) xpos = "50%";
    if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
    if (arguments.length < 3 || outerHeight === null) outerHeight = true;

    // function to be called whenever the window is scrolled or resized
    function update(){
        var pos = $window.scrollTop();

        $this.each(function(){
            var $element = $(this);
            var top = $element.offset().top;
            var height = getHeight($element);

            // Check if totally above or totally below viewport
            if (top + height < pos || top > pos + windowHeight) {
                return;
            }

            $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
        });
    }

    $window.bind('scroll', update).resize(update);
    update();
};
