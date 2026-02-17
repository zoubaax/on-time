/**
 * Dashboard Home Page
 * Beautiful overview with stats and quick actions
 */
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Activity,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        {
            name: 'Total Revenue',
            value: '$45,231',
            change: '+12.5%',
            changeType: 'increase',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
        },
        {
            name: 'Active Users',
            value: '2,345',
            change: '+8.2%',
            changeType: 'increase',
            icon: Users,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            name: 'Engagement Rate',
            value: '68.4%',
            change: '-2.1%',
            changeType: 'decrease',
            icon: Activity,
            color: 'from-purple-500 to-pink-600',
        },
        {
            name: 'Growth',
            value: '+24.5%',
            change: '+4.3%',
            changeType: 'increase',
            icon: TrendingUp,
            color: 'from-orange-500 to-red-600',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div className="space-y-8">
            {/* Welcome section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
            >
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.full_name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-indigo-100">
                    Here's what's happening with your business today.
                </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        variants={itemVariants}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.changeType === 'increase' ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                )}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-600">{stat.name}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-left group">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors">
                            <Users className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Invite Team</h3>
                        <p className="text-sm text-gray-600">Add new team members</p>
                    </button>

                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
                            <Activity className="w-5 h-5 text-purple-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                        <p className="text-sm text-gray-600">Check your metrics</p>
                    </button>

                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-600 transition-colors">
                            <TrendingUp className="w-5 h-5 text-green-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Generate Report</h3>
                        <p className="text-sm text-gray-600">Download insights</p>
                    </button>
                </div>
            </motion.div>

            {/* Recent activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[
                        { action: 'New user signed up', time: '2 minutes ago', color: 'bg-green-100 text-green-600' },
                        { action: 'Payment received', time: '1 hour ago', color: 'bg-blue-100 text-blue-600' },
                        { action: 'Report generated', time: '3 hours ago', color: 'bg-purple-100 text-purple-600' },
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0]}`}></div>
                                <span className="text-gray-900 font-medium">{activity.action}</span>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
