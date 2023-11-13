"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# werkzeug.security methods
def set_password(password, salt):
    return generate_password_hash(f'{password}{salt}')

def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f'{password}{salt}')

@api.route('/hello', methods=['GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# add user
@api.route('/user', methods=['POST'])
def add_user():
    body = request.json

    email = body.get('email')
    password = body.get('password')

    if email is None or len(email.strip()) == 0:
        return jsonify({'message': 'Enter a valid email'}), 400
    
    if password is None or len(password.strip()) == 0:
        return jsonify({'message': 'Enter a valid password'}), 400
    
    # Checking wheter a user exists
    user = User.query.filter_by(email=email).one_or_none()
    if user is not None:
        return jsonify({'message': 'This email is already associated with an account'}), 400
    else:
        salt = b64encode(os.urandom(32)).decode('utf-8')
        password = set_password(password, salt)
        user = User(email=email, password=password, salt=salt)
        db.session.add(user)
        try:
            db.session.commit()
            return jsonify({'message': 'Account has been created successfully'}), 200
        except Exception as error:
            db.session.rollback()
            return jsonify({'message': f'error:{error.args}'}), 400

    return jsonify('OK'), 200

# login
@api.route('/login', methods=['POST'])
def handle_login():
    body = request.json

    email = body.get('email')
    password = body.get('password')

    if email is None or len(email.strip()) == 0:
        return jsonify({'message': 'Enter a valid email'}), 400
    
    if password is None or len(password.strip()) == 0:
        return jsonify({'message': 'Enter a valid password'}), 400
    
    # Checking wheter password is valid
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify({'message': 'User no found'}), 400
    else:
        if check_password(user.password, password, user.salt):
            token = create_access_token(identity=email)
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Token is not valid'}), 401

    return jsonify('OK'), 200

# get users
@api.route('/user', methods=['GET'])
@jwt_required() #include token in thunder client request
def get_users():
    users = User.query.all()
    # Checking wheter a user exists
    if users is None:
        return jsonify({'message': 'There are no users registered'}), 204
    else:
        return jsonify(list(map(lambda user: user.serialize(), users))), 200
    return jsonify('OK'), 200

# get a user
@api.route('/user/<int:user_id>', methods=['GET'])    
@jwt_required() #include token in thunder client request
def get_user(user_id=None):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user.serialize()), 200