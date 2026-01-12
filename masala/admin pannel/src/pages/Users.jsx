import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../utils/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'customer',
        isActive: true,
        password: '', // Only for add
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            // Handle both array and object (nested or flat) responses
            const userList = Array.isArray(response)
                ? response
                : (response.data?.users || response.users || []);
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = () => {
        setModalMode('add');
        setSelectedUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'customer',
            isActive: true,
            password: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            password: '', // Password not editable here
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            try {
                await api.delete(`/admin/users/${user._id}`);
                alert('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.message || 'Failed to delete user');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (modalMode === 'add') {
                // Register new user via auth register since admin/users POST might not exist or be different
                // Actually, let's check if there's an admin/users POST. 
                // Based on admin.routes.js, there is no POST /users. 
                // We should use register if we want to add users from admin. 
                await api.post('/auth/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                alert('User registered successfully');
            } else {
                await api.put(`/admin/users/${selectedUser._id}`, {
                    name: formData.name,
                    role: formData.role,
                    isActive: formData.isActive
                });
                alert('User updated successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className="capitalize px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300">
                    {value}
                </span>
            )
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (value) => <StatusBadge status={value ? 'active' : 'blocked'} />
        },
        {
            key: 'createdAt',
            label: 'Join Date',
            render: (value) => new Date(value).toLocaleDateString()
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your user accounts and permissions
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add New User' : 'Edit User'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Full Name"
                        type="text"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={modalMode === 'edit'}
                    />

                    {modalMode === 'add' && (
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                            Role
                        </label>
                        <select
                            className="input"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="customer">Customer</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="userActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 dark:border-slate-700"
                        />
                        <label htmlFor="userActive" className="text-sm font-medium text-gray-900 dark:text-white">
                            Active Account
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary min-w-[120px]" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (modalMode === 'add' ? 'Add User' : 'Update User')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
