from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Client, User, db # Assuming Client, User models and db are in models.py
from datetime import datetime

bp = Blueprint('main', __name__, url_prefix='/clients') # Keep existing blueprint name and prefix

@bp.route('', methods=['POST'])
@jwt_required()
def create_client():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    current_trainer_id = get_jwt_identity() # Get trainer_id from JWT

    # Basic validation
    required_fields = ['first_name', 'last_name', 'email'] # trainer_id is now from JWT
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Check if client email already exists for this trainer
    existing_client = Client.query.filter_by(email=data.get('email'), trainer_id=current_trainer_id).first()
    if existing_client:
        return jsonify({"error": "Client with this email already exists for this trainer"}), 400

    new_client = Client(
        trainer_id=current_trainer_id, # Set trainer_id from JWT
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        phone_number=data.get('phone_number'),
        date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date() if data.get('date_of_birth') else None,
        address=data.get('address'),
        profile_picture_url=data.get('profile_picture_url'),
        health_notes=data.get('health_notes')
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.to_dict()), 201

@bp.route('', methods=['GET'])
@jwt_required()
def get_clients():
    current_trainer_id = get_jwt_identity()
    clients = Client.query.filter_by(trainer_id=current_trainer_id).all()
    return jsonify([client.to_dict() for client in clients]), 200

@bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    current_trainer_id = get_jwt_identity()
    client = Client.query.filter_by(id=client_id, trainer_id=current_trainer_id).first_or_404()
    return jsonify(client.to_dict()), 200

@bp.route('/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    current_trainer_id = get_jwt_identity()
    client = Client.query.filter_by(id=client_id, trainer_id=current_trainer_id).first_or_404()

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Check if new email already exists for another client of this trainer
    new_email = data.get('email')
    if new_email and new_email != client.email:
        existing_client = Client.query.filter_by(email=new_email, trainer_id=current_trainer_id).first()
        if existing_client:
            return jsonify({"error": "Another client with this email already exists for this trainer"}), 400

    client.first_name = data.get('first_name', client.first_name)
    client.last_name = data.get('last_name', client.last_name)
    client.email = data.get('email', client.email)
    client.phone_number = data.get('phone_number', client.phone_number)
    if data.get('date_of_birth'):
        client.date_of_birth = datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date()
    client.address = data.get('address', client.address)
    client.profile_picture_url = data.get('profile_picture_url', client.profile_picture_url)
    client.health_notes = data.get('health_notes', client.health_notes)

    db.session.commit()
    return jsonify(client.to_dict()), 200

@bp.route('/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    current_trainer_id = get_jwt_identity()
    client = Client.query.filter_by(id=client_id, trainer_id=current_trainer_id).first_or_404()

    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'Client deleted successfully'}), 200
