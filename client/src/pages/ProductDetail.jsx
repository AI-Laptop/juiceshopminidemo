import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/products/${id}/review`, { content: review, rating });
            // Reload product to see new review
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
            setReview('');
        } catch (err) {
            console.error(err);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img className="h-64 w-full object-cover md:w-64" src={product.image_url} alt={product.name} />
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{product.name}</div>
                        <p className="mt-2 text-gray-500">{product.description}</p>
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                        </div>
                        <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition w-full md:w-auto">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold mb-4">Reviews</h3>
                <div className="space-y-4 mb-8">
                    {product.reviews.map((r, i) => (
                        <div key={i} className="border-b pb-4">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">{r.user}</span>
                                <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                            </div>
                            {/* VULNERABILITY: Rendering HTML content directly */}
                            <div dangerouslySetInnerHTML={{ __html: r.content }} />
                        </div>
                    ))}
                </div>

                <h4 className="text-xl font-bold mb-4">Write a Review</h4>
                <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Rating</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>{r} Stars</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Review (Markdown supported)</label>
                        <textarea
                            className="w-full p-2 border rounded h-32"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition w-full md:w-auto">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductDetail;
