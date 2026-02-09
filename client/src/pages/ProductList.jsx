import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (query = '') => {
        try {
            const res = await api.get(`/products?q=${query}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search);
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Products</h2>
            <form onSubmit={handleSearch} className="mb-8 flex flex-col md:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-grow p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition w-full md:w-auto">
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                                <Link to={`/products/${product.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
