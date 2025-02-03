$(".testimonials-carousel").owlCarousel({
  responsiveClass: true,
  loop: true,
  nav: true,
  navText: [
    '<a href="javascript:void(0)"><span class="carousel-prev-arrow"></span></a>',
    '<a href="javascript:void(0)"><span class="carousel-next-arrow"></span></a>',
  ],
  dots: true,
  responsive: {
    0: {
      items: 1,
      nav: false,
    },
    768: {
      items: 1,
    },
    1000: {
      items: 1,
    },
  },
});

Fancybox.bind("[data-fancybox]", {});

$("#contact-form").on("submit", function (e) {
  e.preventDefault();

  $(".empty-field-warning").hide();
  $(".input-wrapper").removeClass("error");

  let formValid = true;

  $(".required-field").each(function () {
    const value = $(this).val();

    if (!value) {
      formValid = false;
      $(this).siblings(".error-tooltip").show();
      $(this).closest(".input-wrapper").addClass("error");
      $(this).trigger("focus");
      return false;
    }
  });

  if (formValid) {
    $(".required-field").each(function () {
      console.log($(this).val());
    });
  }
});

$(".required-field").on("input", function () {
  if ($(this).val()) {
    $(this).siblings(".error-tooltip").hide();
    $(this).closest(".input-wrapper").removeClass("error");
  }
});


