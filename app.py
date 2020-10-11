from flask import Flask
from api.api import api_bp
from client.client import client_bp
import os

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(client_bp)
app.config['SECRET_KEY'] = os.urandom(16)

if __name__ == "__main__":
    app.run()