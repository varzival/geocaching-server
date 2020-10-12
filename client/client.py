from flask import Blueprint, render_template

client_bp = Blueprint("client_bp", __name__, # 'Client Blueprint'
    template_folder="templates", # Required for our purposes
    static_folder="static", # Again, this is required
    static_url_path="/client/static" # Flask will be confused if you don't do this
)

@client_bp.route("/")
def index():
    return render_template("index.html")

@client_bp.route("/game/<game_code>")
def game_view(game_code):
    return render_template("map_view.html", game_code=game_code)