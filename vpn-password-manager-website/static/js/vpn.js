// This file contains JavaScript code specific to the VPN functionality.

document.addEventListener('DOMContentLoaded', function() {
    const vpnForm = document.getElementById('vpn-form');
    const vpnStatus = document.getElementById('vpn-status');

    if (vpnForm) {
        vpnForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(vpnForm);
            const vpnData = {
                username: formData.get('username'),
                password: formData.get('password'),
            };

            // Simulate a VPN connection attempt
            connectToVPN(vpnData);
        });
    }

    function connectToVPN(data) {
        // Simulate an API call to connect to the VPN
        setTimeout(() => {
            if (data.username && data.password) {
                vpnStatus.textContent = 'Connected to VPN successfully!';
                vpnStatus.style.color = 'green';
            } else {
                vpnStatus.textContent = 'Failed to connect. Please check your credentials.';
                vpnStatus.style.color = 'red';
            }
        }, 1000);
    }
});