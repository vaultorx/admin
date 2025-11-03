/* eslint-disable import/order */
/* eslint-disable object-curly-newline */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { ApiClient } from 'adminjs';
import { Box, H2, H5, Illustration, Text, Loader } from '@adminjs/design-system';
import { DashboardData } from '../../types/dashboard.js';

interface QuickLinkCardProps {
  title: string;
  href: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

interface ActionItemProps {
  label: string;
  count: number;
  color: string;
}

// Helper Components
const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Box
    style={{
      flex: '1',
      minWidth: '200px',
      background: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`,
    }}
  >
    <Box flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Text fontSize="sm" opacity={0.7} mb="xs">
          {title}
        </Text>
        <Text fontSize="xxl" fontWeight="bold">
          {value}
        </Text>
      </Box>
      <Box style={{ fontSize: '40px' }}>{icon}</Box>
    </Box>
  </Box>
);

const ActionItem = ({ label, count, color }: ActionItemProps) => (
  <Box
    flex
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    style={{
      padding: '12px',
      borderBottom: '1px solid #E5E7EB',
    }}
  >
    <Text>{label}</Text>
    <Box
      style={{
        background: color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        minWidth: '30px',
        textAlign: 'center',
      }}
    >
      {count}
    </Box>
  </Box>
);

const QuickLinkCard = ({ title, href }: QuickLinkCardProps) => (
  <a
    href={href}
    style={{
      flex: '1',
      minWidth: '150px',
      textDecoration: 'none',
    }}
  >
    <Box
      style={{
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <Text fontWeight="bold" color="#4F46E5">
        {title}
      </Text>
    </Box>
  </a>
);

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = new ApiClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getDashboard();
        setData(response.data as any);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box variant="grey" style={{ padding: '40px', textAlign: 'center' }}>
        <Loader />
        <Text mt="md">Loading dashboard...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box variant="grey" style={{ padding: '40px', textAlign: 'center' }}>
        <Illustration variant="NotFound" />
        <H5 mt="lg">Error Loading Dashboard</H5>
        <Text>{error}</Text>
        <Box mt="lg">
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </Box>
      </Box>
    );
  }

  const defaultData: DashboardData = {
    stats: {
      totalUsers: 0,
      totalNFTs: 0,
      totalCollections: 0,
      activeAuctions: 0,
      totalVolume: '0.00',
      pendingKYC: 0,
      activeExhibitions: 0,
    },
    recentTransactions: [],
    pendingActions: {
      withdrawals: 0,
      deposits: 0,
      kyc: 0,
    },
  };

  const dashboardData = data || defaultData;

  return (
    <Box p="xl">
      <Box flex flexDirection="row" justifyContent="space-between" alignItems="center" mb="xl">
        <Box>
          <H2>Welcome to Vaultorx NFT Marketplace Admin</H2>
          <Text opacity={0.7}>Manage your NFT marketplace, users, collections, and transactions</Text>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box flex flexDirection="row" flexWrap="wrap" style={{ gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Total Users" value={dashboardData.stats.totalUsers} icon="👥" color="#4F46E5" />
        <StatCard title="Total NFTs" value={dashboardData.stats.totalNFTs} icon="🖼️" color="#EC4899" />
        <StatCard title="Total Collections" value={dashboardData.stats.totalCollections} icon="📚" color="#8B5CF6" />
        <StatCard title="Active Auctions" value={dashboardData.stats.activeAuctions} icon="⚡" color="#F59E0B" />
        <StatCard title="Total Volume" value={`${dashboardData.stats.totalVolume} ETH`} icon="💰" color="#10B981" />
        <StatCard title="Pending KYC" value={dashboardData.stats.pendingKYC} icon="📋" color="#EF4444" />
      </Box>

      {/* Recent Activity Section */}
      <Box flex flexDirection="row" flexWrap="wrap" style={{ gap: '20px', marginBottom: '30px' }}>
        <Box
          flex="1"
          style={{
            minWidth: '300px',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <H5 mb="lg">Recent Transactions</H5>
          {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
            <Box>
              {dashboardData.recentTransactions.map((tx, index) => (
                <Box
                  key={index}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Text fontWeight="bold" style={{ textTransform: 'capitalize' }}>
                      {tx.type}
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>
                      {tx.hash?.substring(0, 10)}
                      ...
                    </Text>
                  </Box>
                  <Box style={{ textAlign: 'right' }}>
                    <Text fontWeight="bold">
                      {tx.amount}
                      ETH
                    </Text>
                    <Text
                      fontSize="sm"
                      style={{
                        color: tx.status === 'completed' ? '#10B981' : tx.status === 'failed' ? '#EF4444' : '#F59E0B',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tx.status}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" py="xl">
              <Illustration variant="NotFound" />
              <Text opacity={0.5} mt="md">
                No recent transactions
              </Text>
            </Box>
          )}
        </Box>

        <Box
          flex="1"
          style={{
            minWidth: '300px',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <H5 mb="lg">Pending Actions</H5>
          <ActionItem label="Pending Withdrawals" count={dashboardData.pendingActions.withdrawals} color="#F59E0B" />
          <ActionItem label="Pending Deposits" count={dashboardData.pendingActions.deposits} color="#3B82F6" />
          <ActionItem label="KYC Verifications" count={dashboardData.pendingActions.kyc} color="#EF4444" />
          <ActionItem label="Active Exhibitions" count={dashboardData.stats.activeExhibitions} color="#10B981" />
        </Box>
      </Box>

      {/* Quick Links */}
      <Box>
        <H5 mb="lg">Quick Links</H5>
        <Box flex flexDirection="row" flexWrap="wrap" style={{ gap: '15px' }}>
          <QuickLinkCard title="Manage Users" href="/admin/resources/users" />
          <QuickLinkCard title="View Collections" href="/admin/resources/collections" />
          <QuickLinkCard title="NFT Items" href="/admin/resources/nft_items" />
          <QuickLinkCard title="Transactions" href="/admin/resources/transactions" />
          <QuickLinkCard title="Auctions" href="/admin/resources/auctions" />
          <QuickLinkCard title="Exhibitions" href="/admin/resources/exhibitions" />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
