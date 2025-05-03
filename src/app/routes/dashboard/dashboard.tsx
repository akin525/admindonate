import {JSX, useState} from "react";
import Sidebar from "../../../components/Sidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import { User, BarChart, HandCoins, HandHeart, Activity } from "lucide-react";
// import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext"; // Removed `.tsx` extension

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { admin } = useUser();

    return (
        <div className="min-h-screen text-white flex bg-[#050B1E]">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto">
                    <div className="py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
                            <p className="text-gray-400 mb-8">Platform-wide insights and performance overview.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <StatCard icon={<User className="text-blue-400 w-6 h-6" />} label="Total Users" value={admin?.users ?? 0} />
                                <StatCard icon={<User className="text-green-400 w-6 h-6" />} label="Active Users" value={admin?.active_users ?? 0} />
                                <StatCard icon={<HandHeart className="text-yellow-400 w-6 h-6" />} label="Total Bids" value={admin?.bids ?? 0} />
                                <StatCard icon={<HandCoins className="text-pink-400 w-6 h-6" />} label="Total Asks" value={admin?.asks ?? 0} />
                                <StatCard icon={<Activity className="text-purple-400 w-6 h-6" />} label="Successful Bids" value={admin?.success_bids ?? 0} />
                                <StatCard icon={<Activity className="text-purple-300 w-6 h-6" />} label="Successful Asks" value={admin?.success_asks ?? 0} />
                                <StatCard icon={<BarChart className="text-orange-400 w-6 h-6" />} label="Sum of Bids (USDT)" value={`${admin?.sum_bids ?? 0} USDT`} />
                                <StatCard icon={<BarChart className="text-teal-400 w-6 h-6" />} label="Sum of Asks (USDT)" value={`${admin?.sum_asks ?? 0} USDT`} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Reusable stat card component
function StatCard({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) {
    return (
        <div className="bg-[#070D20] rounded-xl p-6 border border-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{label}</h3>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}
