from flask import Blueprint, request, jsonify
from . import db
from .models import User, OTP
from .utils import generate_otp, send_otp_via_email, is_otp_valid,hash_otp
from flask_jwt_extended import create_access_token
import logging
from flask_limiter.util import get_remote_address
from flask_limiter import Limiter

# Initialize Limiter here, but don't pass `app`
limiter = Limiter(key_func=get_remote_address)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"message": "Email already registered"}), 400

    new_user = User(email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registration successful. Please verify your email."}), 201

@auth_bp.route('/request-otp', methods=['POST'])
@limiter.limit("5 per hour")
def request_otp():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Email not registered"}), 400

    otp = generate_otp()
    hashed_otp = hash_otp(otp)
    new_otp = OTP(user_id=user.id, otp=hashed_otp)
    db.session.add(new_otp)
    db.session.commit()

    send_otp_via_email(email, otp)
    logger.info("OTP request received for email: %s", email)
    logger.info("Generated OTP: %s", otp)

    return jsonify({"message": "OTP sent to your email."}), 200


@auth_bp.route('/verify-otp', methods=['POST'])
@limiter.limit("5 per hour")
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    user_otp = data.get('otp')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Email not registered"}), 400

    otp_obj = OTP.query.filter_by(user_id=user.id).order_by(OTP.created_at.desc()).first()

    if not otp_obj or not is_otp_valid(user_otp, otp_obj):
        return jsonify({"message": "Invalid or expired OTP"}), 400

    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Login successful.", "token": access_token}), 200
