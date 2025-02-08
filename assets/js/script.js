var getUsersTemplate = (name, description, picture) => `
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

var getTableRowTemplate = (user) => `
  <tr data-id="${user.id}">
    <td data-key="firstName">${user.firstName}</td>
    <td data-key="lastName">${user.lastName}</td>
    <td data-key="email">${user.email}</td>
    <td data-key="company">${user.company}</td>
    <td data-key="country">${user.country}</td>
    <td>
      <button class="edit-btn" data-id="${user.id}" data-action="edit" ><i class="fa-solid fa-pencil"></i></button>
      <button class="delete-btn" data-id="${user.id}" data-action="delete" ><i class="fa-solid fa-trash"></i></button>
    </td>
  </tr>
`;

var formDataApiUrl = "http://localhost:3000/formData";

var fetchFormData = async () => {
  try {
    var formData = await $.ajax(formDataApiUrl);
    $(".records-table-body").html(formData.map(getTableRowTemplate).join(""));
    console.log(formData);
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};
fetchFormData();

$(".records-table-body").on("click", "button", async function () {
  const action = $(this).data("action");
  const id = $(this).data("id");
  const row = $(this).closest("tr");

  if (action === "edit") {
    $(".edit-data-form [name]").each(function () {
      $(this).val(row.find(`td[data-key="${$(this).attr("name")}"]`).text());
    });
    $(".edit-data-form").data("id", id).fadeIn();
  }

  if (action === "delete") {
    try {
      await $.ajax({ url: `${formDataApiUrl}/${id}`, type: "DELETE" });
      row.fadeOut();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }
});

$(".edit-data-form").on("submit", async function (e) {
  e.preventDefault();
  var id = $(this).data("id");
  var formData = new FormData(this);
  var updatedData = { id, ...Object.fromEntries(formData.entries()) };
  console.log(updatedData);

  try {
    await $.ajax({
      url: `${formDataApiUrl}/${id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedData),
    });

    alert("User data updated successfully!");
    $(".records-table-body").find(`tr[data-id='${id}']`).replaceWith(getTableRowTemplate(updatedData));
    $(".edit-data-form").fadeOut();
  } catch (error) {
    console.error("Error updating record:", error);
    alert("Failed to update user data.");
  }
});

$(".cancel-button").on("click", (e) => {
  e.preventDefault();
  $(".edit-data-form").fadeOut();
});

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

var getUsers = async () => {
  var usersApiUrl = "https://jsonplaceholder.typicode.com/users?_limit=3";
  var imgApiUrl = "https://randomuser.me/api/";

  var users = await $.ajax({ url: usersApiUrl });

  var usersWithImages = await Promise.all(users.map(async (user) => {
      var imgResponse = await $.ajax({ url: imgApiUrl });
      var userImage = imgResponse.results[0].picture.large;
      return getUsersTemplate(user.name, user.company.catchPhrase, userImage);
    })
  );

  $(".testimonials-carousel").html(usersWithImages.join(" "));
  initTestimonialsCarousel();
  $(".spinner-border").hide();
};
getUsers();

Fancybox.bind("[data-fancybox]", {});

$(".custom-form").on("submit", function (e) {
  e.preventDefault();

  let formValid = true;
  var formData = new FormData(this);
  var values = Object.fromEntries(formData.entries());

  $(".error-tooltip").hide();
  $(".input-wrapper").removeClass("error");

  $(".required-field").each(function () {
    var inputValue = $(this).val().trim();
    if (!inputValue) {
      formValid = false;
      $(this).siblings(".error-tooltip").show();
      $(this).closest(".input-wrapper").addClass("error");
      $(this).trigger("focus");
      return false;
    }
  });

  if (!formValid) return;

  $.ajax({
    url: "http://localhost:3000/formData",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(values),
    success: () => {
      $(".required-field").val("");
      alert("Form submitted successfully!");
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
