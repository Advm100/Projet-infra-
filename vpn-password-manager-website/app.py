# type: ignore
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/generator')
def generator():
    return render_template('generator.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/passwords')
def password_manager():
    return render_template('passwords.html')

@app.route('/inscription')
def inscription():
    return render_template('inscription.html')

if __name__ == '__main__':
    app.run(debug=True)