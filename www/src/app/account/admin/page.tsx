import React from 'react';

export default function  AdminPanel  ()  {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">1,234</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Projects</h3>
                    <p className="text-3xl font-bold text-green-600">42</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Tasks</h3>
                    <p className="text-3xl font-bold text-orange-600">15</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="border-b pb-4">
                            <p className="text-gray-600">User John Doe updated Project X</p>
                            <p className="text-sm text-gray-400">2 hours ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

