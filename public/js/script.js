(function ($) {
    const loginForm = $('#login-form');
    const signupForm = $('#signup-form');
    const serverError = $('#server-error');
    loginForm.on('submit', (event) => {
        try {
            init(event);
            const username = $('#login-username').val();
            const password = $('#login-password').val();
            
            let req = $.ajax({
                method: 'POST',
                url: '/users/login',
                data: {
                    username: username,
                    password: password,
                }
            });
            req.fail((jqXHR, error) => {
                serverError.append(`<p>${jqXHR.responseText}</p>`);
                serverError.show();
            })
        } catch (error) {
            showError(error)
        }
    });

    signupForm.on('submit', (event) => {
        try {
            init(event);
            const username = $('#signup-username').val();
            const password = $('#signup-password').val();
            const firstName = $('#signup-firstName').val();
            const lastName = $('#signup-lastName').val();

            let req = $.ajax({
                method: 'POST',
                url: '/users/signup',
                data: {
                    username: username,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                }
            });
            req.done((data) => {
                window.location.href = '/users/login';
            });
            req.fail((jqXHR, error) => {
                serverError.append(`<p>${jqXHR.responseText}</p>`);
                serverError.show();
            });
        } catch (error) {
            showError(error)
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
  
})(window.jQuery);