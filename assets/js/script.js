const getUsersTemplate = (name, description, picture) => `
  <div class="item testimonial-wrapper">
    <div class="row w-100">
      <div class="col-12 col-sm-4">
        <img src="${picture}" alt="${name}" />
      </div>
      <div class="col-12 col-sm-8">
        <div class="testimonial-content">
          <h3>${name}</h3>
          <h5>${description}</h5>
        </div>
      </div>
    </div>
  </div>
`;

var initTestimonialsCarousel = () => {
  $(".owl-carousel").owlCarousel({
    loop: true,
    items: 1,
    margin: 10,
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
};

async function getUsers() {
  const usersApiUrl = "https://jsonplaceholder.typicode.com/users?_limit=3";
  const imgApiUrl = "https://randomuser.me/api/";

  $(".spinner-border").show();

  const users = await $.ajax({ url: usersApiUrl });

  const usersWithImages = await Promise.all(
    users.map(async (user) => {
      const imgResponse = await $.ajax({ url: imgApiUrl });
      const userImage = imgResponse.results[0].picture.large;
      return getUsersTemplate(user.name, user.company.catchPhrase, userImage);
    })
  );

  $(".testimonials-carousel").html(usersWithImages.join(" "));
  initTestimonialsCarousel();
  $(".spinner-border").hide();
}

getUsers();

Fancybox.bind("[data-fancybox]", {});

$("#contact-form").on("submit", function (e) {
  e.preventDefault();
  $(".error-tooltip").hide();
  $(".input-wrapper").removeClass("error");

  let formValid = true,
    formData = {};

  $(".required-field").each(function () {
    var inputValue = $(this).val().trim();
    if (!inputValue) {
      formValid = false;
      $(this).siblings(".error-tooltip").show();
      $(this).closest(".input-wrapper").addClass("error");
      $(this).trigger("focus");
      return false;
    }
    formData[$(this).attr("name")] = $(this).val();
  });

  if (!formValid) return;

  $.ajax({
    url: "http://localhost:3000/formData789012",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: () => {
      $(".required-field").val("");
      alert("Form submitted successfully!");
      window.open("http://localhost:3000/formData", "_blank");
    },
    error: () => {
      alert("Form submission failed!");
    },
  });
});

$(".required-field").on("input", function () {
  if ($(this).val()) {
    $(this).siblings(".error-tooltip").hide();
    $(this).closest(".input-wrapper").removeClass("error");
  }
});
