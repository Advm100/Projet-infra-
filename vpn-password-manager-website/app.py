from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
import sqlite3
import hashlib
import os
from functools import wraps

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Clé secrète pour les sessions

# Connexion à la base de données
def get_db_connection():
    conn = sqlite3.connect('passwords.db')
    conn.row_factory = sqlite3.Row
    return conn

# Créer les tables si elles n'existent pas
def init_db():
    conn = get_db_connection()
    # Table pour les mots de passe
    conn.execute('''
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            site_name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            site_url TEXT NOT NULL,
            strength TEXT DEFAULT 'medium',
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Table pour les utilisateurs
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

# Fonction pour hacher les mots de passe
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Décorateur pour vérifier si l'utilisateur est connecté
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Veuillez vous connecter pour accéder à cette page')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Fonction pour vérifier si l'utilisateur est connecté (sans redirection)
def is_logged_in():
    return 'user_id' in session

# Route pour la page d'accueil
@app.route('/')
def home():
    return render_template('home.html', logged_in=is_logged_in())

# Route pour l'inscription
@app.route('/inscription', methods=['GET', 'POST'])
def inscription():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        
        # Hacher le mot de passe
        hashed_password = hash_password(password)
        
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                        (username, hashed_password, email))
            conn.commit()
            conn.close()
            flash('Compte créé avec succès! Veuillez vous connecter.')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            conn.close()
            flash('Ce nom d\'utilisateur ou cette adresse email existe déjà!')
            return redirect(url_for('inscription'))
    
    return render_template('inscription.html', logged_in=is_logged_in())

# Route pour la connexion
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Hacher le mot de passe pour le comparer
        hashed_password = hash_password(password)
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                          (username, hashed_password)).fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            flash('Connexion réussie!')
            return redirect(url_for('passwords'))
        else:
            flash('Nom d\'utilisateur ou mot de passe incorrect.')
            return redirect(url_for('login'))
    
    return render_template('login.html', logged_in=is_logged_in())

# Route pour la déconnexion
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    flash('Vous avez été déconnecté.')
    return redirect(url_for('home'))

# Route pour le générateur de mots de passe
@app.route('/generator')
def generator():
    return render_template('generator.html', logged_in=is_logged_in())

# Route pour les paramètres
@app.route('/settings')
def settings():
    # Accessible sans connexion, mais fonctionnalités limitées
    return render_template('settings.html', logged_in=is_logged_in())

# Route pour les statistiques
@app.route('/stats')
def stats():
    # Si l'utilisateur est connecté, on montre ses statistiques personnelles
    if is_logged_in():
        conn = get_db_connection()
        passwords = conn.execute('SELECT * FROM passwords WHERE user_id = ?', (session['user_id'],)).fetchall()
        conn.close()

        # Calculer les statistiques
        total_passwords = len(passwords)
        weak_passwords = len([p for p in passwords if p['strength'] == 'weak'])
        medium_passwords = len([p for p in passwords if p['strength'] == 'medium'])
        strong_passwords = len([p for p in passwords if p['strength'] == 'strong'])
        average_strength = (strong_passwords / total_passwords) * 100 if total_passwords > 0 else 0
    else:
        # Statistiques par défaut ou message pour inciter à se connecter
        total_passwords = 0
        weak_passwords = 0
        medium_passwords = 0
        strong_passwords = 0
        average_strength = 0

    return render_template('stats.html', 
                           logged_in=is_logged_in(),
                           total_passwords=total_passwords,
                           weak_passwords=weak_passwords,
                           medium_passwords=medium_passwords,
                           strong_passwords=strong_passwords,
                           average_strength=average_strength)

# Route pour la gestion des mots de passe (accès)
@app.route('/passwords')
def passwords():
    # On peut accéder à la page, mais on verra un message si non connecté
    return render_template('passwords.html', logged_in=is_logged_in())

# Route pour ajouter un mot de passe (action)
@app.route('/add_password', methods=['POST'])
@login_required  # Cette action nécessite d'être connecté
def add_password():
    # Récupérer les données du formulaire
    site_name = request.json.get('siteName')
    site_url = request.json.get('siteUrl')
    username = request.json.get('username')
    password = request.json.get('password')
    strength = request.json.get('strength', 'medium')  # Par défaut 'medium'

    # Ajouter le mot de passe à la base de données
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO passwords (user_id, site_name, site_url, username, password, strength)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (session['user_id'], site_name, site_url, username, password, strength))
    conn.commit()

    # Récupérer tous les mots de passe pour les afficher
    cursor.execute('SELECT * FROM passwords WHERE user_id = ?', (session['user_id'],))
    passwords = cursor.fetchall()
    conn.close()

    # Convertir les mots de passe en format JSON
    passwords_json = [dict(row) for row in passwords]

    # Retourner la liste des mots de passe
    return jsonify({
        'status': 'success',
        'passwords': passwords_json
    }), 200

@app.route('/get_passwords', methods=['GET'])
def get_passwords():
    # Si l'utilisateur n'est pas connecté, renvoyer un tableau vide
    if not is_logged_in():
        return jsonify([]), 200
    
    conn = get_db_connection()
    passwords = conn.execute('SELECT * FROM passwords WHERE user_id = ?', (session['user_id'],)).fetchall()
    conn.close()

    # Convertir les mots de passe en format JSON
    passwords_json = [dict(row) for row in passwords]

    return jsonify(passwords_json), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True)