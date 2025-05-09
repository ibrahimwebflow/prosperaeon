import { supabase } from "./supabase.js";

// Function to generate a random referral code
function generateReferralCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function signUpUser(firstName, lastName, country, email, tel, username, password, referralCode) {
    // Step 1: Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Signup Error:", authError.message);
        return;
    }

    const newUserId = authData.user.id;
    const generatedReferralCode = generateReferralCode();

    // Step 2: Insert into users table
    const { error: userError } = await supabase
        .from("users")
        .insert([
            {
                id: newUserId,
                first_name: firstName,
                last_name: lastName,
                country: country,
                email: email,
                tel: tel,
                username: username,
                referral_code: referralCode,                // what user entered
                generated_referral_code: generatedReferralCode // your unique code
            }
        ]);

    if (userError) {
        console.error("User Insert Error:", userError.message);
        return;
    }

    // Step 3: If referral code was entered, save referral relationship
    if (referralCode && referralCode.trim() !== "") {
        const { data: referrer, error: findError } = await supabase
            .from("users")
            .select("id")
            .eq("generated_referral_code", referralCode)
            .single();

        if (findError) {
            console.warn("Invalid referral code entered.");
        } else {
            const { error: referralInsertError } = await supabase
                .from("referral_user")
                .insert([
                    {
                        referrer_id: referrer.id,
                        referred_id: newUserId
                    }
                ]);

            if (referralInsertError) {
                console.error("Referral relationship insert error:", referralInsertError.message);
            } else {
                console.log("Referral relationship recorded.");
            }
        }
    }

    console.log("Signup complete!");
    window.location.href = "dashboard.html";
}

// Handle form submit
document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const country = document.getElementById("country").value;
    const email = document.getElementById("email").value;
    const tel = document.getElementById('tel').value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const referralCode = document.getElementById("referralCode").value;

    await signUpUser(firstName, lastName, country, email, tel, username, password, referralCode);
});
