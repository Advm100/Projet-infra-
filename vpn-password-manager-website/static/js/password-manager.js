document.addEventListener('DOMContentLoaded', function() {
    // Éléments UI
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const passwordsView = document.getElementById('passwords-view');
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');
    const userMenuBtn = document.getElementById('user-menu-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addPasswordBtn = document.getElementById('add-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelPasswordBtn = document.getElementById('cancel-password');
    const savePasswordBtn = document.getElementById('save-password');
    const passwordForm = document.getElementById('password-form');
    const passwordSearch = document.getElementById('password-search');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const filterButtons = document.querySelectorAll('.btn-filter');
    const copyButtons = document.querySelectorAll('.btn-copy');
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');
  
    // Variables d'état
    let currentView = 'login-view';
    let currentUser = null;
    let passwords = [
      { id: 1, site: 'Google', username: 'utilisateur@gmail.com', password: 'P@ssw0rd!G', strength: 90, icon: 'google', favorite: true },
      { id: 2, site: 'Facebook', username: 'nom.utilisateur', password: 'Fb12345!', strength: 65, icon: 'facebook', favorite: false },
      { id: 3, site: 'Amazon', username: 'utilisateur@email.com', password: 'amazon123', strength: 35, icon: 'amazon', favorite: true }
    ];
  
    // Fonctions utilitaires
    function showView(viewId) {
      // Cacher toutes les vues
      document.querySelectorAll('.view, .active-view').forEach(view => {
        view.classList.remove('active-view');
        view.classList.add('view');
      });
      
      // Afficher la vue demandée
      const viewToShow = document.getElementById(viewId);
      if (viewToShow) {
        viewToShow.classList.remove('view');
        viewToShow.classList.add('active-view');
        currentView = viewId;
      }
    }
  
    function updateNavigation() {
      navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (currentView === `${href}-view`) {
          link.parentElement.classList.add('active');
        }
      });
    }
  
    function updateUserInfo(user) {
      const userInfo = document.querySelector('.user-info');
      const userDetails = userInfo.querySelector('.user-details');
      
      if (user) {
        userDetails.querySelector('.username').textContent = user.username;
        userDetails.querySelector('.status').textContent = 'Connecté';
        userDetails.querySelector('.status').classList.remove('offline');
        userDetails.querySelector('.status').classList.add('online');
        
        // Mettre à jour l'affichage du nom d'utilisateur dans le menu
        const usernameDisplay = document.querySelector('.username-display');
        if (usernameDisplay) {
          usernameDisplay.textContent = user.username;
        }
      } else {
        userDetails.querySelector('.username').textContent = 'Non connecté';
        userDetails.querySelector('.status').textContent = 'Déconnecté';
        userDetails.querySelector('.status').classList.remove('online');
        userDetails.querySelector('.status').classList.add('offline');
      }
    }
  
    function showPasswordModal(passwordId = null) {
      const modalTitle = passwordModal.querySelector('.modal-header h3');
      const passwordObject = passwordId ? passwords.find(p => p.id === passwordId) : null;
      
      if (passwordObject) {
        modalTitle.textContent = 'Modifier le mot de passe';
        document.getElementById('site-name').value = passwordObject.site;
        document.getElementById('site-url').value = passwordObject.url || '';
        document.getElementById('username-field').value = passwordObject.username;
        document.getElementById('password-field').value = passwordObject.password;
        document.getElementById('password-notes').value = passwordObject.notes || '';
        passwordForm.dataset.passwordId = passwordId;
      } else {
        modalTitle.textContent = 'Ajouter un mot de passe';
        passwordForm.reset();
        delete passwordForm.dataset.passwordId;
      }
      
      passwordModal.style.display = 'flex';
    }
  
    function closePasswordModal() {
      passwordModal.style.display = 'none';
    }
  
    function savePassword() {
      const siteNameInput = document.getElementById('site-name');
      const siteUrlInput = document.getElementById('site-url');
      const usernameInput = document.getElementById('username-field');
      const passwordInput = document.getElementById('password-field');
      const notesInput = document.getElementById('password-notes');
      
      if (!siteNameInput.value || !passwordInput.value) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      
      const passwordId = passwordForm.dataset.passwordId ? parseInt(passwordForm.dataset.passwordId) : null;
      
      if (passwordId) {
        // Modification d'un mot de passe existant
        const passwordIndex = passwords.findIndex(p => p.id === passwordId);
        if (passwordIndex !== -1) {
          passwords[passwordIndex] = {
            ...passwords[passwordIndex],
            site: siteNameInput.value,
            url: siteUrlInput.value,
            username: usernameInput.value,
            password: passwordInput.value,
            notes: notesInput.value,
            strength: calculatePasswordStrength(passwordInput.value)
          };
        }
      } else {
        // Ajout d'un nouveau mot de passe
        const newId = passwords.length > 0 ? Math.max(...passwords.map(p => p.id)) + 1 : 1;
        const newPassword = {
          id: newId,
          site: siteNameInput.value,
          url: siteUrlInput.value,
          username: usernameInput.value,
          password: passwordInput.value,
          notes: notesInput.value,
          strength: calculatePasswordStrength(passwordInput.value),
          icon: getIconForSite(siteNameInput.value),
          favorite: false
        };
        
        passwords.push(newPassword);
      }
      
      refreshPasswordList();
      closePasswordModal();
    }
  
    function calculatePasswordStrength(password) {
      // Logique simplifiée pour calculer la force du mot de passe
      let strength = 0;
      
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 15;
      if (/[A-Z]/.test(password)) strength += 10;
      if (/[a-z]/.test(password)) strength += 10;
      if (/[0-9]/.test(password)) strength += 10;
      if (/[^A-Za-z0-9]/.test(password)) strength += 15;
      if (/(.)\1\1/.test(password)) strength -= 10; // Pénalité pour caractères répétés
      
      return Math.min(100, Math.max(0, strength));
    }
  
    function getIconForSite(siteName) {
      // Logique pour déterminer l'icône en fonction du nom du site
      siteName = siteName.toLowerCase();
      const knownSites = {
        'google': 'google',
        'facebook': 'facebook',
        'amazon': 'amazon',
        'twitter': 'twitter',
        'instagram': 'instagram',
        'linkedin': 'linkedin',
        'github': 'github',
        'apple': 'apple',
        'microsoft': 'microsoft'
      };
      
      for (const [key, value] of Object.entries(knownSites)) {
        if (siteName.includes(key)) {
          return value;
        }
      }
      
      return 'globe';
    }
  
    function refreshPasswordList() {
      const passwordList = document.querySelector('.password-list');
      
      // Filtrer les mots de passe si nécessaire
      let filteredPasswords = [...passwords];
      const searchTerm = passwordSearch.value.toLowerCase();
      
      if (searchTerm) {
        filteredPasswords = filteredPasswords.filter(p => 
          p.site.toLowerCase().includes(searchTerm) || 
          p.username.toLowerCase().includes(searchTerm)
        );
      }
      
      // Vérifier si le filtre "Favoris" est actif
      const favoriteFilterActive = document.querySelector('.btn-filter.active').textContent.includes('Favoris');
      if (favoriteFilterActive) {
        filteredPasswords = filteredPasswords.filter(p => p.favorite);
      }
      
      // Mettre à jour les compteurs
      document.querySelectorAll('.btn-filter .count')[0].textContent = passwords.length;
      document.querySelectorAll('.btn-filter .count')[1].textContent = passwords.filter(p => p.favorite).length;
      
      // Mettre à jour la liste des mots de passe
      passwordList.innerHTML = '';
      
      filteredPasswords.forEach(password => {
        const passwordItem = document.createElement('div');
        passwordItem.className = 'password-item';
        passwordItem.dataset.passwordId = password.id;
        
        const strengthClass = password.strength >= 70 ? 'high' : password.strength >= 40 ? 'medium' : 'low';
        
        passwordItem.innerHTML = `
          <div class="site-info">
            <div class="favicon"><i class="fab fa-${password.icon}"></i></div>
            <div>
              <div class="site-name">${password.site}</div>
              <div class="username">${password.username}</div>
            </div>
          </div>
          <div class="password-strength">
            <div class="strength-bar">
              <div class="strength-level ${strengthClass}" style="width: ${password.strength}%;"></div>
            </div>
          </div>
          <div class="actions">
            <button title="Copier le mot de passe" class="btn-copy"><i class="fas fa-copy"></i></button>
            <button title="Modifier" class="btn-edit"><i class="fas fa-edit"></i></button>
            <button title="Supprimer" class="btn-delete"><i class="fas fa-trash"></i></button>
          </div>
        `;
        
        passwordList.appendChild(passwordItem);
      });
      
      // Réattacher les événements aux nouveaux boutons
      attachPasswordItemEvents();
    }
  
    function attachPasswordItemEvents() {
      document.querySelectorAll('.password-item .btn-copy').forEach(button => {
        button.addEventListener('click', function() {
          const passwordId = parseInt(this.closest('.password-item').dataset.passwordId);
          const passwordObject = passwords.find(p => p.id === passwordId);
          
          if (passwordObject) {
            navigator.clipboard.writeText(passwordObject.password)
              .then(() => {
                // Afficher une notification de succès
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                  this.innerHTML = originalIcon;
                }, 1500);
              })
              .catch(err => {
                console.error('Erreur lors de la copie du mot de passe:', err);
                alert('Impossible de copier le mot de passe. Veuillez réessayer.');
              });
          }
        });
      });
      
      document.querySelectorAll('.password-item .btn-edit').forEach(button => {
        button.addEventListener('click', function() {
          const passwordId = parseInt(this.closest('.password-item').dataset.passwordId);
          showPasswordModal(passwordId);
        });
      });
      
      document.querySelectorAll('.password-item .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
          const passwordId = parseInt(this.closest('.password-item').dataset.passwordId);
          
          if (confirm('Êtes-vous sûr de vouloir supprimer ce mot de passe ?')) {
            passwords = passwords.filter(p => p.id !== passwordId);
            refreshPasswordList();
          }
        });
      });
    }
  
    // Écouteurs d'événements
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('master-password').value;
      
      if (username && password) {
        // Simulation d'authentification (à remplacer par une vraie authentification)
        currentUser = {
          username: username,
          loggedIn: true
        };
        
        updateUserInfo(currentUser);
        showView('dashboard-view');
        updateNavigation();
      } else {
        alert('Veuillez remplir tous les champs.');
      }
    });
  
    registerLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Fonctionnalité d\'inscription à venir.');
    });
  
    userMenuBtn.addEventListener('click', function() {
      const dropdownMenu = document.querySelector('.dropdown-menu');
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
  
    // Fermer le menu déroulant si on clique ailleurs
    document.addEventListener('click', function(e) {
      if (!e.target.matches('.btn-user') && !e.target.matches('.btn-user *')) {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu && dropdownMenu.style.display === 'block') {
          dropdownMenu.style.display = 'none';
        }
      }
    });
  
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentUser = null;
      updateUserInfo(null);
      showView('login-view');
    });
  
    // Navigation
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!currentUser && this.getAttribute('href') !== '#login') {
          alert('Veuillez vous connecter d\'abord.');
          return;
        }
        
        const viewId = this.getAttribute('href').substring(1) + '-view';
        showView(viewId);
        updateNavigation();
        
        // Fermer le menu déroulant
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
          dropdownMenu.style.display = 'none';
        }
      });
    });
  
    // Filtres de mots de passe
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        refreshPasswordList();
      });
    });
  
    // Recherche de mots de passe
    passwordSearch.addEventListener('input', function() {
      refreshPasswordList();
    });
  
    // Gestion des mots de passe
    addPasswordBtn.addEventListener('click', function() {
      showPasswordModal();
    });
  
    closeModalBtn.addEventListener('click', function() {
      closePasswordModal();
    });
  
    cancelPasswordBtn.addEventListener('click', function() {
      closePasswordModal();
    });
  
    savePasswordBtn.addEventListener('click', function() {
      savePassword();
    });
  
    // Fermer la modal si on clique en dehors
    passwordModal.addEventListener('click', function(e) {
      if (e.target === passwordModal) {
        closePasswordModal();
      }
    });
  
    // Boutons de visibilité du mot de passe
    togglePasswordBtns.forEach(button => {
      button.addEventListener('click', function() {
        const passwordInput = this.parentElement.querySelector('input');
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
          passwordInput.type = 'password';
          this.innerHTML = '<i class="fas fa-eye"></i>';
        }
      });
    });
  
    // Initialisation
    refreshPasswordList();
    attachPasswordItemEvents();
    
    // Pour le démo seulement: mettre à jour les statistiques du dashboard
    if (document.querySelector('.dashboard-stats')) {
      document.querySelector('.dashboard-stats .stat-card:nth-child(1) .stat-number').textContent = passwords.length;
      document.querySelector('.dashboard-stats .stat-card:nth-child(2) .stat-number').textContent = passwords.filter(p => p.strength < 40).length;
      
      const avgStrength = passwords.reduce((sum, p) => sum + p.strength, 0) / passwords.length;
      document.querySelector('.dashboard-stats .stat-card:nth-child(3) .strength-level').style.width = `${avgStrength}%`;
    }
  });

  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        const viewId = this.getAttribute("href").substring(1) + "-view";

        // Masquer toutes les vues
        document.querySelectorAll(".view, .active-view").forEach(view => {
            view.classList.remove("active-view");
            view.classList.add("view");
        });

        // Afficher la bonne vue
        const selectedView = document.getElementById(viewId);
        if (selectedView) {
            selectedView.classList.remove("view");
            selectedView.classList.add("active-view");
        }
    });
});