console.log("Login script loaded!");

import { supabase } from "./supabase.js";  // Import Supabase Client

// Prevent form auto-refreshing
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop default form refresh

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    console.log("Attempting login..."); // Debugging log

    // Step 1: Authenticate using Supabase Auth (password is stored here)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Auth Error:", authError.message);
        alert("Login failed: " + authError.message);
        return;
    }

    console.log("Auth Success:", authData);

    // Step 2: Fetch extra user info from `public.users` table
    const { data: userData, error: userError } = await supabase
        .from("users")  // Our public users table
        .select("*")
        .eq("email", email)
        .single();

    if (userError) {
        console.error("User Fetch Error:", userError.message);
        alert("Login successful but user info not found.");
    } else {
        console.log("User Data:", userData);
    }

    // Step 3: Redirect after login
    window.location.href = "dashboard.html";
});
