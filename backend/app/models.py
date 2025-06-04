from . import db, bcrypt # Assuming db and bcrypt are initialized in __init__.py
from sqlalchemy.sql import func

class User(db.Model):
    __tablename__ = 'User' # Explicitly set table name to match SQL schema

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    bio = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(255))
    specialization = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # Relationship to Client model
    clients = db.relationship('Client', backref='trainer', lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'bio': self.bio,
            'profile_picture_url': self.profile_picture_url,
            'specialization': self.specialization,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at)
        }

class Client(db.Model):
    __tablename__ = 'Client' # Explicitly set table name to match SQL schema

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False) # Matches User table name 'User'
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(50))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(255))
    health_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'trainer_id': self.trainer_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'date_of_birth': str(self.date_of_birth) if self.date_of_birth else None,
            'address': self.address,
            'profile_picture_url': self.profile_picture_url,
            'health_notes': self.health_notes,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at)
        }
