from flask import Blueprint, request, jsonify
from models import db, Order, User
import jwt
from functools import wraps
from flask import current_app

user_bp = Blueprint('user', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({'username': current_user.username, 'is_admin': current_user.is_admin})

@user_bp.route('/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()
    output = [{'id': o.id, 'total': o.total_amount, 'status': o.status, 'date': o.created_at} for o in orders]
    return jsonify(output)

@user_bp.route('/orders/<int:order_id>', methods=['GET'])
@token_required
def get_order_detail(current_user, order_id):
    # VULNERABILITY: IDOR
    # No check if order.user_id == current_user.id
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    return jsonify({
        'id': order.id,
        'user_id': order.user_id, # Leaking user_id
        'total': order.total_amount,
        'status': order.status,
        'items': '...' # Placeholder
    })
