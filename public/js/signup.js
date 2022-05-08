async function signUpUI(event) {
  try {
    event.preventDefault();
    const signUpFirstName = document.getElementById("signup-firstName").value;
    const signUpLastName = document.getElementById("signup-lastName").value;
    const signUpUsername = document.getElementById("signup-username").value;
    const signUpPassword = document.getElementById("signup-password").value;
    let img = document.getElementById("displayPicture").files[0];
    img = await convertToBase64(img);
    document.getElementById("displayPictureImg").src = img;
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

    let response = await fetch("/users/signup", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    response = await response.json();
    window.location.href = `/users/login`;
  } catch (error) {
    console.log(error);
  }
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function getUser(event) {
  try {
    event.preventDefault();
    const signUpUsername = document.getElementById("signup-username").value;
    const signUpPassword = document.getElementById("signup-password").value;
    const signUpFirstName = document.getElementById("signup-firstName").value;
    const signUpLastName = document.getElementById("signup-lastName").value;
    let img = document.getElementById("displayPicture");
    const signUpGender = document.querySelector(
      'input[name="gender"]:checked'
    ).value;
    const signUpAge = document.getElementById("age").value;
    const signUpPhone = document.getElementById("phone").value;
    const signUpDescription = document.getElementById("description").value;
    const signUpInterests = document.getElementById("interests").value;
    let signUpGenders = document.getElementById("genders").value;
    const minAge = document.getElementById("minAge").value;
    const maxAge = document.getElementById("maxAge").value;

    signUpGenders = signUpGenders.split(",");
    let data = {
      username: signUpUsername,
      password: signUpPassword,
      firstName: signUpFirstName,
      lastName: signUpLastName,
      displayPicture: img,
      gender: signUpGender,
      age: signUpAge,
      phone: signUpPhone,
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

    fetch("/users/signup", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        window.location.href = data.data.url;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function LoadImage() {
  let img = document.getElementById("displayPicture").files[0];
  img = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
  document.getElementById("displayPictureImg").src = img;
}
