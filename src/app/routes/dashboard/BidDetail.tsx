import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function BidDetail() {
    const { id } = useParams(); // Get the bid ID from URL
    const [bid, setBid] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchBid = async () => {
            try {
                const res = await fetch(`${baseUrl}bid-details/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setBid(data.data || null);
            } catch (err) {
                console.error("Failed to fetch bid", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBid();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-[#050B1E] text-white flex items-center justify-center">Loading...</div>;
    }

    if (!bid) {
        return <div className="min-h-screen bg-[#050B1E] text-white flex items-center justify-center">Bid not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[#050B1E] text-white flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto py-10 px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto bg-[#1A202C] p-8 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold mb-6 text-center">Bid Details</h1>

                        <div className="space-y-4">
                            <p><span className="font-semibold">Bid ID:</span> {bid.id}</p>
                            <p><span className="font-semibold">Amount:</span> {bid.amount} USDT</p>
                            <p><span className="font-semibold">Amount to Pair:</span> {bid.amount_to_pair} USDT</p>
                            <p><span className="font-semibold">Transaction ID (TRX):</span> {bid.trx}</p>
                            <p><span className="font-semibold">Status:</span> {bid.status}</p>
                            <p><span className="font-semibold">Plan ID:</span> {bid.plan_id}</p>
                            <p><span className="font-semibold">Created At:</span> {new Date(bid.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
