import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

const statusTabs = [
    { label: "Awaiting Payment", value: "awaiting_payment" },
    { label: "Payment Submitted", value: "payment_submitted" },
    { label: "Payment Confirmed", value: "payment_confirmed" },
];

const PeerStatusPage = () => {
    const [activeStatus, setActiveStatus] = useState("awaiting_payment");
    const [peers, setPeers] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null as string | null,
        prev_page_url: null as string | null,
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchPeers = async (status: string, url?: string) => {
        setLoading(true);
        try {
            const endpoint = url || `${baseUrl}peers/${status}`;
            const res = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success && json.data) {
                setPeers(json.data.data);
                setPagination({
                    current_page: json.data.current_page,
                    last_page: json.data.last_page,
                    next_page_url: json.data.next_page_url,
                    prev_page_url: json.data.prev_page_url,
                });
            } else {
                setPeers([]);
            }
        } catch (error) {
            console.error("Error fetching peers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeers(activeStatus);
    }, [activeStatus]);

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "awaiting_payment":
                return "bg-yellow-500";
            case "payment_submitted":
                return "bg-blue-500";
            case "payment_confirmed":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white flex">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />
                <div className="p-6 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-semibold mb-6">Peer Payment Status</h1>

                    <div className="flex gap-4 mb-6">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveStatus(tab.value)}
                                className={`px-5 py-2 rounded-full font-medium transition ${
                                    activeStatus === tab.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                    ) : (
                        <div className="bg-[#111827] border border-gray-700 rounded-xl overflow-x-auto shadow-lg">
                            <table className="min-w-full table-auto text-sm">
                                <thead>
                                <tr className="bg-[#1f2937] text-gray-300 text-left uppercase text-xs">
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Bid User</th>
                                    <th className="px-6 py-4">Ask User</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Due At</th>
                                </tr>
                                </thead>
                                <tbody>
                                {peers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
                                            No data found.
                                        </td>
                                    </tr>
                                ) : (
                                    peers.map((peer: any) => (
                                        <tr
                                            key={peer.id}
                                            className="border-t border-gray-700 hover:bg-[#1e293b]"
                                        >
                                            <td className="px-6 py-4">{peer.reference}</td>
                                            <td className="px-6 py-4">{peer.bid_user?.username || "N/A"}</td>
                                            <td className="px-6 py-4">{peer.ask_user?.username || "N/A"}</td>
                                            <td className="px-6 py-4">{peer.pair_amount} USDT</td>
                                            <td className="px-6 py-4">
                          <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                  peer.status
                              )}`}
                          >
                            {peer.status.replace(/_/g, " ")}
                          </span>
                                            </td>
                                            <td className="px-6 py-4">{peer.due_at}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
                        <button
                            disabled={!pagination.prev_page_url}
                            onClick={() => fetchPeers(activeStatus, pagination.prev_page_url!)}
                            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 text-white"
                        >
                            Previous
                        </button>
                        <span>
              Page {pagination.current_page} of {pagination.last_page}
            </span>
                        <button
                            disabled={!pagination.next_page_url}
                            onClick={() => fetchPeers(activeStatus, pagination.next_page_url!)}
                            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 text-white"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeerStatusPage;
