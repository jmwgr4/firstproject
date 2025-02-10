document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });
        
        const data = await response.json();

        if(data.success){
            window.location.href = "/main";
        } else {
            errorMessage.textContent = data.message || "Invalid username or password!";
            errorMessage.style.color = "red";
        }
    } catch (error){
        console.error("Error logging in:", error);
        errorMessage.textContent = "Something went wrong!";
        errorMessage.style.color = "red";
    }
    
});

function showHint(id) {
    document.getElementById(id).style.display = "block";
}

function hideHint(id) {
    document.getElementById(id).style.display = "none;"
}