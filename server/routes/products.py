from flask import Blueprint, request, jsonify
from models import db, Product, Review
from sqlalchemy import text

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    query = request.args.get('q')
    
    if query:
        # VULNERABILITY: SQL Injection via direct string concatenation
        # Hidden as a "performance optimization" for complex text search
        sql = f"SELECT * FROM product WHERE name LIKE '%{query}%' OR description LIKE '%{query}%'"
        try:
            result = db.session.execute(text(sql))
            products = [{'id': row.id, 'name': row.name, 'description': row.description, 'price': row.price, 'image_url': row.image_url} for row in result]
            return jsonify(products)
        except Exception as e:
            return jsonify({'error': 'Search failed'}), 500
    
    products = Product.query.all()
    output = [{'id': p.id, 'name': p.name, 'description': p.description, 'price': p.price, 'image_url': p.image_url} for p in products]
    return jsonify(output)

@products_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    reviews = [{'user': r.user.username, 'content': r.content, 'rating': r.rating} for r in product.reviews]
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url,
        'reviews': reviews
    })

@products_bp.route('/<int:id>/review', methods=['POST'])
def add_review(id):
    # VULNERABILITY: Stored XSS
    # Content is stored directly and will be rendered by frontend dangerously
    data = request.get_json()
    # Assume user_id comes from token middleware (simplified here for brevity, assume user_id=1 if not provided)
    # In real implementation, we'd decode the token.
    user_id = data.get('user_id', 2) 
    
    new_review = Review(product_id=id, user_id=user_id, content=data['content'], rating=data['rating'])
    db.session.add(new_review)
    db.session.commit()
    return jsonify({'message': 'Review added'}), 201
