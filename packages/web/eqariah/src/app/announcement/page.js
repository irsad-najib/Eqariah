"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AnnouncementDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        detail: '',
        category_id: ''
    });

    // Form management state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Categories
    const [categories] = useState([
        { id: 'announcement', name: 'Announcement' },
        { id: 'appeal', name: 'Appeal' }
    ]);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get('https://f5c7-125-160-108-193.ngrok-free.app/api/auth/verify-session', {
                    withCredentials: true
                });

                if (response.data.authenticated) {
                    setIsAuthenticated(true);
                    setUserRole(response.data.user.role);
                } else {
                    router.replace('/login');
                }
            } catch (error) {
                console.error('Session verification failed:', error);
                router.replace('/login');
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://f5c7-125-160-108-193.ngrok-free.app/api/auth/announcements', {
                    withCredentials: true
                });
                setAnnouncements(response.data);
            } catch (err) {
                console.error("Error fetching announcements", err);
            }
        };

        verifySession();
        if (isAuthenticated) {
            fetchAnnouncements();
        }
    }, [isAuthenticated, router]);


    const validateForm = () => {
        const { title, detail, category_id } = newAnnouncement;

        if (!title.trim() || !detail.trim() || !category_id.trim()) {
            setError('All fields are required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (userRole !== 'admin') {
            setError('only admin can create');
            return;
        }
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'https://f5c7-125-160-108-193.ngrok-free.app/api/auth/announcement',
                newAnnouncement,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 201) {
                setSuccess(response.data.message || 'Announcement created successfully');
                setNewAnnouncement({
                    title: '',
                    detail: '',
                    category_id: ''
                });

                // Refresh announcements
                const updatedResponse = await axios.get('https://f5c7-125-160-108-193.ngrok-free.app/api/auth/announcements', {
                    withCredentials: true
                });
                setAnnouncements(updatedResponse.data);
            }
        } catch (err) {
            console.error('Announcement creation error:', err);

            if (err.response?.status === 403) {
                setError('You do not have permission to create announcements');
            } else if (err.response?.status === 401) {
                setError('Session expired. Please log in again');
                router.replace('/login');
            } else {
                setError(err.response?.data?.error || "Failed to create announcement");
            }
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        // Create a backup of current state
        const previousAnnouncements = [...announcements];

        // Optimistically update UI
        setAnnouncements(currentAnnouncements =>
            currentAnnouncements.map(announcement =>
                announcement.id === id
                    ? {
                        ...announcement,
                        inbox_read: announcement.inbox_read
                            ? [...announcement.inbox_read, { is_read: true }]
                            : [{ is_read: true }]
                    }
                    : announcement
            )
        );

        try {
            // Send mark as read request
            const response = await axios.post(
                `https://f5c7-125-160-108-193.ngrok-free.app/api/auth/announcement/read/${id}`,
                {}, // Empty body
                {
                    withCredentials: true, // Move here
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.data.success) {
                // If server indicates failure, revert to previous state
                setAnnouncements(previousAnnouncements);
                throw new Error(response.data.message);
            }

            // Refresh the announcements to ensure sync with server
            const refreshResponse = await axios.get('https://f5c7-125-160-108-193.ngrok-free.app/api/auth/announcements', {
                withCredentials: true
            });
            setAnnouncements(refreshResponse.data);

        } catch (err) {
            console.error('Mark as read error:', err.response ? err.response.data : err.message);
            // Revert to previous state on error
            setAnnouncements(previousAnnouncements);
        }
    };


    const handleLogout = async () => {
        try {
            await axios.post('https://f5c7-125-160-108-193.ngrok-free.app/api/auth/logout', {}, {
                withCredentials: true
            });
            router.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            router.replace('/login');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {userRole === 'admin' && (
                <div className="bg-white shadow-md rounded-lg mb-6 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Create New Announcement</h2>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                required
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Announcement Details"
                                value={newAnnouncement.detail}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, detail: e.target.value })}
                                required
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            />
                        </div>
                        <div>
                            <select
                                value={newAnnouncement.category_id}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category_id: e.target.value })}
                                required
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? "Creating Announcement..." : "Create Announcement"}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">{announcement.title}</h3>
                            <span className="text-sm text-gray-500">
                                {new Date(announcement.create_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm text-blue-500">
                                {announcement.category?.name || 'Uncategorized'}
                            </span>
                        </div>
                        <p className="mb-4">{announcement.detail}</p>
                        {!announcement.inbox_read?.[0]?.is_read && (
                            <button
                                onClick={() => markAsRead(announcement.id)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
                            >
                                Mark as Read
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}