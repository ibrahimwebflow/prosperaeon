import { supabase } from "./supabase.js";  // Import Supabase Client

async function signUpUser(firstName, lastName, country, email, username, password, referralCode) {
    // Step 1: Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Signup Error:", authError.message);
        return;
    }

    // Step 2: Insert user data into the "users" table
    const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
            {
                id: authData.user.id,  // Store auth user ID
                first_name: firstName,
                last_name: lastName,
                country: country,
                email: email,
                username: username,
                referral_code: referralCode
            }
        ]);

    if (userError) {
        console.error("Database Insert Error:", userError.message);
        return;
    }

    console.log("Signup Success:", authData);
    window.location.href = "dashboard.html";  // Redirect on success
}

// Example: Handle form submission
document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const country = document.getElementById("country").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const referralCode = document.getElementById("referralCode").value;

    await signUpUser(firstName, lastName, country, email, username, password, referralCode);
});



