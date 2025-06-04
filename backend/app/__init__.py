from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from backend.config import Config # Corrected import

db = SQLAlchemy()
bcrypt = Bcrypt() # Initialize Bcrypt
jwt = JWTManager() # Initialize JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app) # Initialize Bcrypt with app
    jwt.init_app(app)   # Initialize JWTManager with app

    from . import routes
    app.register_blueprint(routes.bp) # Existing client routes

    # Import and register auth blueprint (will be created in next step)
    from .auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app
