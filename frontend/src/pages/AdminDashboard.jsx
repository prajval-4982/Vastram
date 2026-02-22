import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, Users, ChevronDown, ChevronUp,
    Clock, CheckCircle, Truck, XCircle, Loader, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI, adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statusFlow = [
    'pending', 'confirmed', 'picked-up', 'in-progress', 'ready', 'out-for-delivery', 'delivered'
];

const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    'confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    'picked-up': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    'in-progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    'ready': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    'out-for-delivery': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        loadData();
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [ordersRes, usersRes] = await Promise.all([
                ordersAPI.getOrders({ limit: 50 }),
                adminAPI.getAllUsers({ limit: 100 }),
            ]);
            setOrders(ordersRes.data.orders);
            setUsers(usersRes.data.users);
        } catch (err) {
            console.error('Failed to load admin data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrder(orderId);
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            await loadData();
        } catch (err) {
            console.error('Failed to update order status:', err);
            alert('Failed to update order status.');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const getNextStatus = (current) => {
        const idx = statusFlow.indexOf(current);
        return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

    if (!user || user.role !== 'admin') return null;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Loading admin dashboard..." />
            </div>
        );
    }

    const totalRevenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

    const tabs = [
        { id: 'orders', label: 'Orders', icon: Package, count: orders.length },
        { id: 'users', label: 'Users', icon: Users, count: users.length },
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage orders & users</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Orders', value: orders.length, icon: Package, color: 'from-blue-500 to-blue-600' },
                        { label: 'Active Orders', value: activeOrders, icon: Clock, color: 'from-amber-500 to-orange-500' },
                        { label: 'Pending Orders', value: pendingOrders, icon: Loader, color: 'from-red-500 to-rose-500' },
                        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 ring-1 ring-gray-200 dark:ring-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-3">
                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No orders yet.</div>
                        ) : (
                            orders.map((order) => {
                                const isExpanded = expandedOrder === order._id;
                                const nextStatus = getNextStatus(order.status);
                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden"
                                    >
                                        {/* Order Header */}
                                        <button
                                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        #{order.orderNumber}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || ''}`}>
                                                    {order.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-primary-600 dark:text-primary-400">
                                                    ₹{order.total}
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
                                                {/* Customer Info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400">Customer</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {order.customer?.name || 'N/A'} ({order.customer?.email})
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400">Payment</p>
                                                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                            {order.paymentMethod} — {order.paymentStatus}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Items</p>
                                                    <div className="space-y-1">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm">
                                                                <span className="text-gray-700 dark:text-gray-300">
                                                                    {item.serviceName} × {item.quantity}
                                                                </span>
                                                                <span className="text-gray-900 dark:text-white font-medium">
                                                                    ₹{item.subtotal}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Status Actions */}
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {nextStatus && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                                            disabled={updatingOrder === order._id}
                                                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            {updatingOrder === order._id ? (
                                                                <Loader className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Truck className="w-4 h-4" />
                                                            )}
                                                            Move to: {nextStatus.replace('-', ' ')}
                                                        </button>
                                                    )}
                                                    {!['cancelled', 'delivered'].includes(order.status) && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                                            disabled={updatingOrder === order._id}
                                                            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Membership</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Orders</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 capitalize text-gray-700 dark:text-gray-300">{u.membershipTier}</td>
                                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{u.totalOrders || 0}</td>
                                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">₹{u.totalSpent || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
