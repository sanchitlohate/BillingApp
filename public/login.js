function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email === "" || password === "") {
        document.getElementById("message").innerText =
            "Please fill all fields";
        return;
    }

    document.getElementById("message").innerText =
        "Email: " + email + " | Password: " + password;
}
