document
  .getElementById("register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const gender = document.getElementById("gender").value;
    const location = document.getElementById("location").value;

    const response = await fetch("http://localhost:3000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        password,
        gender,
        location,
      }),
    });

    const result = await response.text();
    alert(result);
  });

document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:3000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const result = await response.text();
    alert(result);
  });
