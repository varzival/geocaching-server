from flask import Blueprint, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import os


api_bp = Blueprint('api_bp', __name__)

engine = create_engine(os.environ.get("DATABASE_URL"))
db_session = Session(engine)

Base = automap_base()
Base.prepare(engine, reflect=True)

Game = Base.classes.Games
Quiz = Base.classes.Quizes

@api_bp.route("/greeting")
def greeting():
    return {'greeting': 'Hello from Flask!'}

@api_bp.route("/games")
def games():
    games = db_session.query(Game).all()
    dic = dict()
    for game in games:
        dic[game.id] = {
            "code": game.code,
            "name": game.code
        }
    return jsonify(dic)

@api_bp.route("/quizes")
def quizes():
    quizes = db_session.query(Quiz).all()
    dic = dict()
    for quiz in quizes:
        dic[quiz.id] = {
            "lon": quiz.lon,
            "lat": quiz.lat,
            "game_id": quiz.game_id,
            "correct": quiz.correct,
            "options": quiz.options
        }
    return jsonify(dic)

@api_bp.route("/game/<game_code>")
def game(game_code):
    quizes = db_session.query(Quiz).join(Game).filter(Game.code == game_code).all()
    ret = list()
    for quiz in quizes:
        ret.append({
            "lon": quiz.lon,
            "lat": quiz.lat,
            "game_id": quiz.game_id,
            "correct": quiz.correct,
            "options": quiz.options
        })
    return jsonify(ret)