$(() => {
  const loginForm = $("#login-form");
  const serverError = $("#server-error");
  loginForm.on("submit", (event) => {
    try {
      init(event);
      const username = $("#login-username").val();
      const password = $("#login-password").val();

      let req = $.ajax({
        method: "POST",
        url: "/users/login",
        data: {
          username: username,
          password: password,
        },
      });
      req.fail((jqXHR, error) => {
        serverError.append(`<p>${jqXHR.responseText}</p>`);
        serverError.show();
      });
      req.done((data) => {
        window.location.href = data.data.url;
      });
    } catch (error) {
      showError(error);
    }
  });

  function showError(error) {
    const errorElem = $(`#${error.id}`);
    errorElem.append(`<p>${error.message}</p>`);
    errorElem.show();
  }
  function init(event) {
    event.preventDefault();
    serverError.empty();
    serverError.hide();
  }
});

async function searchUsers(event) {
  try {
    event.preventDefault();
    const searchTerm = document.getElementById("searchTerm").value;

    window.location.href = `/users?searchTerm=${searchTerm}`;
  } catch (error) {
    console.log(error);
  }
}
