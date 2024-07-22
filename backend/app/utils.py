import random
import hashlib
from datetime import datetime, timedelta
from .models import OTP
import string

def generate_otp(length=6):
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp

def hash_otp(otp):
    return hashlib.sha256(otp.encode()).hexdigest()

def send_otp_via_email(email, otp):
    print(f'OTP for {email}: {otp}')

def is_otp_valid(user_otp, otp_obj):
    hashed_otp = hash_otp(user_otp)
    return hashed_otp == otp_obj.otp and datetime.utcnow() - otp_obj.created_at < timedelta(minutes=5)
