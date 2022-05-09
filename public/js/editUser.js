async function editUserUI(event) {
  try {
    event.preventDefault();
    const signUpFirstName = document.getElementById("signup-firstName").value;
    const signUpLastName = document.getElementById("signup-lastName").value;
    const signUpUsername = document.getElementById("signup-username").value;
    const signUpPassword = document.getElementById("signup-password").value;
    let img = document.getElementById("displayPicture").src;
    const signUpGender = document.querySelector(
      'input[name="gender"]:checked'
    ).value;
    const signUpAge = document.getElementById("age").value;
    const signUpDescription = document.getElementById("description").value;
    const signUpInterests = document.getElementById("interests").value;
    let signUpGenders = document.getElementById("genders").value;
    const minAge = document.getElementById("minAge").value;
    const maxAge = document.getElementById("maxAge").value;

    signUpGenders = signUpGenders.split(",");
    let data = {
      firstName: signUpFirstName,
      lastName: signUpLastName,
      username: signUpUsername,
      password: signUpPassword,
      displayPicture: img,
      gender: signUpGender,
      age: signUpAge,
      description: signUpDescription,
      interests: signUpInterests,
      preferences: {
        genders: signUpGenders,
        age: {
          min: minAge,
          max: maxAge,
        },
      },
    };

    data = JSON.stringify(data);

    let response = await fetch("/users/", {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    response = await response.json();
    window.location.href = response.data.url;
  } catch (error) {
    console.log(error);
  }
}

$(document).ready(function () {
  // Prepare the preview for profile picture
  $("#displayPicture").change(function () {
    readURL(this);
  });
});
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#displayPictureImg").attr("src", e.target.result).fadeIn("slow");
      $("#displayPicture").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
