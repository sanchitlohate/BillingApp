function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      return res.json();
    })
    .then(data => {
      alert("Login successful");
      window.location.href = "/dashboard.html";
    })
    .catch(err => {
      alert("Invalid email or password");
    });
}
