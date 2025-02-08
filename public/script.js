async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("error-message");
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password})
    });

    const data = await response.json();

    if(data.success){
        localStorage.setItem("auth", "true");
        window.location = "main.html";
    }else{
        errorMessage.innerText = "Invalid username or password!";
    }

    
}