import { db } from '../../db/index.js';

export const dashboardHandler = async () => {
  try {
    // Get the Knex instance from the adapter
    const knex = (dbName: string) => db.table(dbName).knex(dbName);

    // Fetch total users
    const users = await knex('profiles').select();
    const totalUsers = users.length;
    const pendingKYC = users.filter((u) => u.kycStatus === 'pending').length;

    // Fetch NFT items
    const nftItems = await knex('nft_items').select();
    const totalNFTs = nftItems.length;

    // Fetch collections
    const collections = await knex('collections').select();
    const totalCollections = collections.length;

    // Calculate total volume from collections
    const totalVolume = collections.reduce((sum, col) => sum + (parseFloat(col.totalVolume) || 0), 0);

    // Fetch active auctions
    const auctions = await knex('auctions').select();
    const activeAuctions = auctions.filter((a) => a.status === 'live').length;

    // Fetch active exhibitions
    const exhibitions = await knex('exhibitions').select();
    const activeExhibitions = exhibitions.filter((e) => e.status === 'active').length;

    // Fetch recent transactions (last 5)
    const transactions = await knex('transactions').select().orderBy('createdAt', 'desc').limit(5);

    const recentTransactions = transactions.map((tx) => ({
      type: tx.transactionType,
      hash: tx.transactionHash,
      amount: tx.price || 0,
      status: tx.status,
    }));

    // Fetch pending actions
    const withdrawalRequests = await knex('withdrawal_requests').select();
    const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending').length;

    const depositRequests = await knex('deposit_requests').select();
    const pendingDeposits = depositRequests.filter((d) => d.status === 'pending').length;

    return {
      stats: {
        totalUsers,
        totalNFTs,
        totalCollections,
        activeAuctions,
        totalVolume: totalVolume.toFixed(2),
        pendingKYC,
        activeExhibitions,
      },
      recentTransactions,
      pendingActions: {
        withdrawals: pendingWithdrawals,
        deposits: pendingDeposits,
        kyc: pendingKYC,
      },
    };
  } catch (error) {
    console.error('Error in dashboard handler:', error);
    return {
      stats: {
        totalUsers: 0,
        totalNFTs: 0,
        totalCollections: 0,
        activeAuctions: 0,
        totalVolume: '0',
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
  }
};
