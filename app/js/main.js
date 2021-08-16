// Smooth scroll
$('a[href^="#"], *[data-href^="#"]').on("click", (function (e) {
    e.preventDefault();
    var c = $(this).attr("data-href") ? $(this).attr("data-href") : $(this).attr("href");
    $("html,body").stop().animate({
        scrollTop: $(c).offset().top
    }, 1e3)
})),

// Fly icon
$(window).on("load", (function () {
    $("span[id^=icon]").addClass("icon_fly");
})),

// Phone mask
$('input[type="tel"]').inputmask({
    mask: "+7 (999) 999-99-99"
}),

// Mobile menu
$(document).on('mouseup', function (e){
    var button = $(".button-mobile")
    var div = $(".header-nav__list");

    if (!div.is(e.target)
        && window.innerWidth < 992
        && div.is(":visible")) {
        div.hide("slow");
    }
    else if (button.is(e.target)
        && div.is(":hidden")) {
        div.show("slow");
    }
});

// Owl-carousel
var owl = $(".owl-carousel");
owl.owlCarousel({
    margin: 50,
    loop: true,
    dots: false,
    nav: false,
    navText: ["<img src='img/arrow-left.png'>","<img src='img/arrow-right.png'>"],
    responsive: {
        0: {
            items: 1,
            dots: true
        },
        767: {
            items: 2,
            dots: true
        },
        992: {
            items: 3,
            nav: true,
        }
    }
})

// Onn/off scroll
const scroll = function (e) {
    e.preventDefault()
},
disableScroll = function (e) {
    window.addEventListener("mousewheel", scroll, {
            passive: !1
        }),
        $("body, html").on("DOMMouseScroll", (function (e) {
            return !1
        })),
        $("body, html").on("keydown", (function (e) {
            if (e.which > 32 && e.which < 41)
                return !1
        }))
},
enableScroll = function (e) {
    window.removeEventListener("mousewheel", scroll, {
            passive: !1
        }),
        $("body, html").off("keydown DOMMouseScroll")
};

// Form validation
$("form").each((function () {
    $(this).validate({
        errorPlacement: (e, c) => !0,
        focusInvalid: !1,
        rules: {
            "Имя": {
                required: !0
            },
            "Телефон": {
                required: !0,
                minlenght: 11
            },
            "Текст": {
                required: !0
            }
        },
        submitHandler(e) {
            let c = $(e);
            let formInput = $("form :input")
            let thankYou = $('.thank-you');
            return $.ajax({
                type: "POST",
                url: "mail.php",
                data: c.serialize(),
                success: function (e) {
                    c.trigger("reset"),
                    c.hide(300),
                    formInput.val(""),
                    thankYou.show(300)
                }
            }),
            !1
        }
    })
})),

// Disabling scrolling when opening a modal window
$(window).on("resize load", (function (e) {
var e = $(".head__wrap");
$(window).width() < 768 ? (e.remove(),
        e.appendTo(".mobile__head")) : (e.remove(),
        e.appendTo(".head")),
$(".header__button, .head__button, .about__button, .features__button, .footer__button").on("click", (function () {
    $(".modal").css("display", "flex"),
        $(".modal").fadeIn(1500, disableScroll)
}))

$("#text").on("mouseenter", function(){
    if($(this)[0].scrollHeight > $(this)[0].clientHeight) {
        $("body, html", enableScroll)
    }
    else {
        $("body, html", disableScroll)
    }
})

// Clearing the form after sending the data
$(".modal").on("click", (function (e) {
    e.target == this && ($(this).fadeOut(1500, enableScroll),
        $("form :input").val(""),
        $(".form__input, .form__text").removeClass('error'))
}))

$(".modal__close").on("click", (function (e) {
    e.target == this && ($(".modal").fadeOut(1500, enableScroll),
        $("form :input").val(""),
        $(".form__input, .form__text").removeClass('error'))
}))
}));