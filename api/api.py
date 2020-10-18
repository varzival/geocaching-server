from flask import Blueprint, jsonify, request, abort
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import os
import random
import string

api_bp = Blueprint('api_bp', __name__)

engine = create_engine(os.environ.get("DATABASE_URL"))
db_session = Session(engine)

Base = automap_base()
Base.prepare(engine, reflect=True)

Game = Base.classes.Games
Quiz = Base.classes.Quizes

code_length = 6
def random_string():
    return ''.join(random.choice(string.ascii_lowercase) for i in range(code_length))

@api_bp.route("/greeting")
def greeting():
    return {'greeting': 'Hello from Flask!'}

@api_bp.route("/game", methods=["POST"])
@api_bp.route("/game/<game_code>", methods=["GET", "POST", "DELETE"])
def game(game_code=None):
    if game_code:
        game_code = game_code.lower()

    try: 
        if request.method == "GET":
            if not game_code:
                abort(404)
            
            game = db_session.query(Game).filter(Game.code == game_code).first()
            if not game:
                abort(404)
            quizes = db_session.query(Quiz).join(Game).filter(Game.code == game_code).all()
            quiz_arr = list()
            for quiz in quizes:
                quiz_arr.append({
                    "lon": quiz.lon,
                    "lat": quiz.lat,
                    "correct": quiz.correct,
                    "text": quiz.text,
                    "options": quiz.options
                })
            ret = {
                "name": game.name,
                "quizes": quiz_arr
            }
            return jsonify(ret)

        elif request.method == "POST":
            if game_code == None:
                game = Game(code=random_string(), name="")
                db_session.add(game)
                db_session.flush()
                db_session.refresh(game)

            game = db_session.query(Game).filter(Game.code == game_code).first()
            if not game:
                game = Game(code=random_string() if not game_code else game_code, name="")
                db_session.add(game)
                db_session.flush()
                db_session.refresh(game)

            data = request.get_json()
            if data:
                name = data.get("name")
                if name:
                    game.name = name

                quizes_posted = data.get("quizes")
                if quizes_posted:
                    if not isinstance(quizes_posted, list):
                        abort(400)
                    db_session.query(Quiz).filter(game.id == Quiz.id).delete()

                    for quiz in quizes_posted:
                        db_session.add(Quiz(**quiz))

            db_session.commit()
            return jsonify({"code": game.code}), 200

        elif request.method == "DELETE":
            if not game_code:
                abort(404)

            game = db_session.query(Game).filter(Game.code == game_code).first()
            if not game:
                abort(404)
            db_session.query(Quiz).filter(game.id == Quiz.id).delete()
            db_session.delete(game)
            db_session.commit()
            return "success", 200

    except:
        db_session.rollback()
        raise