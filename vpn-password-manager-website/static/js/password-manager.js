// This file contains JavaScript code for the password manager section, managing user input and interactions.

document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('password-form');
    const passwordList = document.getElementById('password-list');

    passwordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const websiteInput = document.getElementById('website').value;
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        if (websiteInput && usernameInput && passwordInput) {
            addPasswordEntry(websiteInput, usernameInput, passwordInput);
            passwordForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });

    function addPasswordEntry(website, username, password) {
        const entry = document.createElement('li');
        entry.textContent = `Website: ${website}, Username: ${username}, Password: ${password}`;
        passwordList.appendChild(entry);
    }
});