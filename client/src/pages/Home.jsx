import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="text-center mt-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to JuicyPro</h1>
            <p className="text-lg text-gray-600 mb-8">The most secure and premium juice shop on the internet.</p>
            <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                Shop Now
            </Link>
        </div>
    );
}

export default Home;
