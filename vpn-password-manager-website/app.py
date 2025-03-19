# type: ignore
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/vpn')
def vpn():
    return render_template('vpn.html')

@app.route('/password-manager')
def password_manager():
    return render_template('password-manager.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/inscription')
def inscription():
    return render_template('inscription.html')

if __name__ == '__main__':
    app.run(debug=True)