document.getElementById('admin-login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorMsg = document.getElementById('error-message');
  
    const adminCreds = {
      usernameHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA-256 of "admin"
      passwordHash: '72ac67a088736a27b52a55e7576f5853aa417d51b35718a435a90422a5f81cc7'  // SHA-256 of "Secure#2025"
    };
  
    async function sha256(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  
    (async () => {
      const usernameHash = await sha256(username);
      const passwordHash = await sha256(password);
  
      // ✅ Log the hashes you're generating
      console.log("Entered Username Hash:", usernameHash);
      console.log("Entered Password Hash:", passwordHash);
  
      if (
        usernameHash === adminCreds.usernameHash &&
        passwordHash === adminCreds.passwordHash
      ) {
        localStorage.setItem('admin_logged_in', 'true');
        window.location.href = "admin_dashboard.html";
      }
       else {
        errorMsg.textContent = "Invalid credentials. Access denied.";
      }
    })();
  });
  
  
  