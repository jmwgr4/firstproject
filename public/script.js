async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password}),
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        if(data.success){
            localStorage.setItem("auth", "true");
            window.location = "main.html";
        }else{
            errorMessage.innerText = "Invalid username or password!";
        }
    } catch(error) {
        errorMessage.innerText = "An error occured. Try Again!";
        console.error("Login error: ", error);
    }
}