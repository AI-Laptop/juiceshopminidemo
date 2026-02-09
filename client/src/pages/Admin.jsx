import React, { useState } from 'react';
import api from '../api';

function Admin() {
    const [host, setHost] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSystemCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // VULNERABILITY: Command Injection
            // The backend passes 'host' directly to a shell command.
            const res = await api.post('/admin/system-check', { host });
            setOutput(res.data.output);
        } catch (err) {
            setOutput('Check failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">System Health Check</h3>
                <p className="text-gray-600 mb-4">Ping a server to check connectivity.</p>
                <form onSubmit={handleSystemCheck} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter hostname or IP (e.g., google.com)"
                        className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Run Check'}
                    </button>
                </form>

                {output && (
                    <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded font-mono whitespace-pre-wrap">
                        {output}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
