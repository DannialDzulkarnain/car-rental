import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Testimonial, Article, AppUser } from '../../../types';
import ArticleEditor from './ArticleEditor';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'testimonials' | 'articles' | 'users'>('testimonials');
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        if (!isAdmin) return;

        // Subscribe to Testimonials
        const qTestimonials = query(collection(db, 'car-rental-testimonials'), orderBy('createdAt', 'desc'));
        const unsubTestimonials = onSnapshot(qTestimonials, (snapshot) => {
            setTestimonials(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
        });

        // Subscribe to Articles
        const qArticles = query(collection(db, 'car-rental-articles'), orderBy('createdAt', 'desc'));
        const unsubArticles = onSnapshot(qArticles, (snapshot) => {
            setArticles(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
        });

        // Subscribe to Users
        const qUsers = query(collection(db, 'car-rental-users'), orderBy('lastSignIn', 'desc'));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
            setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppUser)));
        });

        return () => {
            unsubTestimonials();
            unsubArticles();
            unsubUsers();
        };
    }, [isAdmin]);

    const handleApproveTestimonial = async (id: string, currentStatus: boolean) => {
        await updateDoc(doc(db, 'car-rental-testimonials', id), { approved: !currentStatus });
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            await deleteDoc(doc(db, 'car-rental-testimonials', id));
        }
    };

    const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'remove admin rights from' : 'grant admin rights to';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            await updateDoc(doc(db, 'car-rental-users', userId), { isAdmin: !currentStatus });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            await deleteDoc(doc(db, 'car-rental-users', userId));
        }
    };

    const handleTogglePublish = async (articleId: string, currentStatus: boolean) => {
        await updateDoc(doc(db, 'car-rental-articles', articleId), { published: !currentStatus });
    };

    const handleDeleteArticle = async (articleId: string) => {
        if (confirm('Are you sure you want to delete this article?')) {
            await deleteDoc(doc(db, 'car-rental-articles', articleId));
        }
    };

    if (!user || !isAdmin) {
        return <div className="p-10 text-center">Access Denied</div>;
    }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                </div>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`${activeTab === 'testimonials' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Testimonials
                </button>
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`${activeTab === 'articles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Articles (SEO)
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Users ({users.length})
                </button>
            </nav>
        </div>

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {testimonials.map((t) => (
                        <li key={t.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-medium text-gray-900">{t.name}</h3>
                                        {t.rating && <span className="text-yellow-500">{'★'.repeat(t.rating)}</span>}
                                        {!t.approved && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">Pending</span>}
                                    </div>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                    <p className="mt-2 text-gray-700">{t.text}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleApproveTestimonial(t.id!, t.approved)}
                                        className={`px-3 py-1 rounded text-sm ${t.approved ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}
                                    >
                                        {t.approved ? 'Unapprove' : 'Approve'}
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteTestimonial(t.id!)}
                                        className="px-3 py-1 rounded text-sm bg-red-100 text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {testimonials.length === 0 && <li className="p-6 text-center text-gray-500">No testimonials found.</li>}
                </ul>
            </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
            <div>
                {!showEditor ? (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={() => setShowEditor(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                            >
                                Write New Article
                            </button>
                        </div>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {articles.map((article) => (
                                <div key={article.id} className="bg-white shadow rounded-lg overflow-hidden">
                                     {article.image && (
                                        <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${article.image.startsWith('http') ? article.image : 'https://storage.bijokdev.com' + article.image})` }} />
                                     )}
                                     <div className="p-6">
                                        <h3 className="font-bold text-xl mb-2">{article.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                            <span>{article.author}</span>
                                            <span className={`px-2 py-1 rounded ${article.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {article.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => { setEditingArticle(article); setShowEditor(true); }}
                                                className="flex-1 px-3 py-2 rounded text-sm font-medium bg-blue-100 text-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleTogglePublish(article.id!, article.published)}
                                                className={`flex-1 px-3 py-2 rounded text-sm font-medium ${article.published ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                                            >
                                                {article.published ? 'Unpublish' : 'Publish'}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteArticle(article.id!)}
                                                className="px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ArticleEditor 
                        onClose={() => { setShowEditor(false); setEditingArticle(null); }}
                        editArticle={editingArticle}
                    />
                )}
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {users.map((u) => (
                        <li key={u.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {u.photoURL ? (
                                        <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                                            {u.displayName?.charAt(0) || u.email?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-gray-900">{u.displayName || 'No Name'}</h3>
                                            {u.isAdmin && (
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Admin</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{u.email}</p>
                                        <p className="text-xs text-gray-400">
                                            Last sign-in: {u.lastSignIn?.toDate?.()?.toLocaleString() || 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleToggleAdmin(u.id!, u.isAdmin)}
                                        className={`px-3 py-1 rounded text-sm ${u.isAdmin ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                                    >
                                        {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(u.id!)}
                                        className="px-3 py-1 rounded text-sm bg-red-100 text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {users.length === 0 && <li className="p-6 text-center text-gray-500">No users found.</li>}
                </ul>
            </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
