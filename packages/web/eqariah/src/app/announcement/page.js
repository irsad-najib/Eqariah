"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function announcementsDashboard() {
    const Router = useRouter();
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncements, setNewAnnouncements] = useState({ title: '', detail: '', category_id: '' });
    const [categories, setCategories] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            Router.push('../login');
            return
        }

        const chekAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/users/role', {
                    headers: { Authorization: 'Bearer ${token}' },
                    withCredentials: true
                });
                setIsAdmin(response.data.role === 'admin')
            } catch (err) {
                console.error(err)
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/announcements', {
                    headers: { Authorization: 'Bearer ${token}' }
                });

                setAnnouncements(response.data)
            } catch (err) {
                console.error(err);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/categories', {
                    headers: { Authorization: 'Bearer ${token}' }
                });

                setCategories(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        chekAdmin();
        fetchAnnouncements();
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3001/api/announcement/read/${id}', {}, {
                headers: { Authorization: 'Bearer${token}' }
            });

            setNewAnnouncements({ title: '', detail: '', category_id: '' });
            const response = await axios.get('http://localhost:3001/api/announcements', {
                headers: { Authorization: 'Bearer${token}' }
            });
            setAnnouncements(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3001/api/announcement/read/${id}', {
                headers: { Authorization: 'Bearer${token}' }
            });

            const response = await axios.get('http://localhost:3001/api/announcements', {
                headers: { Authorization: 'Bearer${token}' }
            });
            setAnnouncements(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {isAdmin && (
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Buat Pengumuman Baru</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Judul"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
                                    placeholder="Detail pengumuman"
                                    value={newAnnouncement.detail}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, detail: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={newAnnouncement.category_id}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category_id: e.target.value })}
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit">Kirim Pengumuman</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <Card key={announcement.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">{announcement.title}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(announcement.create_at).toLocaleDateString()}
                                </span>
                            </div>
                            <span className="text-sm text-blue-500">{announcement.category?.name}</span>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{announcement.detail}</p>
                            {!announcement.inbox_read?.[0]?.is_read && (
                                <Button
                                    onClick={() => markAsRead(announcement.id)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Tandai Sudah Dibaca
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}