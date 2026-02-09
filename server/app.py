from flask import Flask
from flask_cors import CORS
from models import db, User, Product, Order, Review

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///juicypro.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'super_secret_key_123' # Weak key, but standard for dev

    CORS(app)
    db.init_app(app)

    with app.app_context():
        # Import routes here to avoid circular imports
        from routes.auth import auth_bp
        from routes.products import products_bp
        from routes.user import user_bp
        from routes.admin import admin_bp
        
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(products_bp, url_prefix='/api/products')
        app.register_blueprint(user_bp, url_prefix='/api/user')
        app.register_blueprint(admin_bp, url_prefix='/api/admin')

        db.create_all()
        seed_data()

    return app

def seed_data():
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', password='admin123', is_admin=True)
        user = User(username='user', password='password', is_admin=False)
        db.session.add(admin)
        db.session.add(user)
        
        p1 = Product(name='Premium Juice', description='Freshly squeezed.', price=10.0, image_url='https://placehold.co/200')
        p2 = Product(name='Golden Apple', description='Shiny and expensive.', price=50.0, image_url='https://placehold.co/200')
        db.session.add(p1)
        db.session.add(p2)
        
        db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
