$( document ).ready(function() {
    initSwiper();
    function initSwiper() {
        var scene = document.getElementById('main_container');
        var parallaxInstance = new Parallax(scene, {
            relativeInput: true,
            pointerEvents: false
        });

        var mySwiper = new Swiper('.swiper-container', {
            centeredSlides: true,
            slidesPerView: 'auto',
            longSwipesMs: 0,
            loopPreventsSlide:false,
            longSwipes: true,
            longSwipesRatio: 0,
            threshold: 0,
            slideToClickedSlide:true,
            speed: 900,
            loop: true,
            loopedSlides:2,
            spaceBetween: 20,
            on: {
                init: function () {

                },
            }
        });
        mySwiper.on('touchEnd', () => {
            console.log($('.swiper-slide-active span').attr('datasrc'));
            ListenPhoto();
        })
    }
    if ($(".swiper-slide-active").length){
        ListenPhoto();
    }
    function ListenPhoto(){
        var adressdotterimage = $('.swiper-slide-active span').attr('datasrc');
        var UrlArray = adressdotterimage.split(',');
        $('.js_first_photo .image_container').animate({
            opacity: 0
        }, 100, function() {
            // Callback
            $('.js_first_photo .image_container').css('background-image', 'url(' + UrlArray[0] + ')').promise().done(function(){
                // Callback of the callback :)
                $(this).animate({
                    opacity: 1
                }, 100)
            });
        });
        $('.js_second_photo .image_container').animate({
            opacity: 0
        }, 100, function() {
            // Callback
            $('.js_second_photo .image_container').css('background-image', 'url(' + UrlArray[1] + ')').promise().done(function(){
                // Callback of the callback :)
                $(this).animate({
                    opacity: 1
                }, 100)
            });
        });
        $('.js_third_photo .image_container').animate({
            opacity: 0
        }, 100, function() {
            // Callback
            $('.js_third_photo .image_container').css('background-image', 'url(' + UrlArray[2] + ')').promise().done(function(){
                // Callback of the callback :)
                $(this).animate({
                    opacity: 1
                }, 100)
            });
        });
    }
});
