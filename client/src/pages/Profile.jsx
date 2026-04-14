import React, { useState, useEffect } from 'react';
import api from '../api';

function Profile() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/user/profile');
                setUser(userRes.data);
                const ordersRes = await api.get('/user/orders');
                setOrders(ordersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleViewOrder = async (orderId) => {
        try {
            // VULNERABILITY: IDOR
            // The backend doesn't check if the order belongs to the user.
            // An attacker could manually change the ID in the request.
            const res = await api.get(`/user/orders/${orderId}`);
            setSelectedOrder(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Profile</h2>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.is_admin ? 'Admin' : 'User'}</p>
            </div>

            <h3 className="text-2xl font-bold mb-4">Order History</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleViewOrder(order.id)}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Order Details #{selectedOrder.id}</h3>
                        <p><strong>User ID:</strong> {selectedOrder.user_id}</p>
                        <p><strong>Total:</strong> ${selectedOrder.total}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-6 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
