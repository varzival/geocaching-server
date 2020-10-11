from flask import Blueprint

api_bp = Blueprint('api_bp', __name__)

@api_bp.route("/greeting")
def greeting():
    return {'greeting': 'Hello from Flask!'}