import { AdminJSOptions } from 'adminjs';

import { db } from '../db/index.js';

import componentLoader from './component-loader.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [
    // User related resources
    {
      resource: db.table('users'),
      options: {
        listProperties: ['id', 'email', 'username', 'role', 'kycStatus', 'walletBalance', 'createdAt'],
        filterProperties: ['email', 'username', 'role', 'kycStatus', 'emailVerified'],
        properties: {
          password: { isVisible: false },
          externalWalletSeed: { isVisible: false },
          createdAt: { isVisible: { list: true, show: true, edit: false } },
          updatedAt: { isVisible: { list: false, show: true, edit: false } },
          role: {
            availableValues: [
              { label: 'Super Admin', value: 'SUPERADMIN' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'User', value: 'USER' },
            ],
          },
          kycStatus: {
            availableValues: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ],
          },
        },
      },
    },
    {
      resource: db.table('user_notification_settings'),
      options: {
        listProperties: ['id', 'userId', 'emailNotifications', 'pushNotifications'],
      },
    },

    // NFT & Collection resources
    {
      resource: db.table('collections'),
      options: {
        listProperties: ['id', 'name', 'contractAddress', 'creatorId', 'verified', 'floorPrice', 'totalVolume'],
        properties: {
          createdAt: { isVisible: { list: false, show: true, edit: false } },
          updatedAt: { isVisible: { list: false, show: true, edit: false } },
          verified: {
            availableValues: [
              { label: 'Verified', value: true },
              { label: 'Not Verified', value: false },
            ],
          },
        },
      },
    },
    {
      resource: db.table('nft_items'),
      options: {
        listProperties: ['id', 'name', 'collectionId', 'ownerId', 'isListed', 'listPrice', 'rarity', 'views'],
        properties: {
          createdAt: { isVisible: { list: false, show: true, edit: false } },
          updatedAt: { isVisible: { list: false, show: true, edit: false } },
          rarity: {
            availableValues: [
              { label: 'Common', value: 'Common' },
              { label: 'Rare', value: 'Rare' },
              { label: 'Epic', value: 'Epic' },
              { label: 'Legendary', value: 'Legendary' },
            ],
          },
        },
      },
    },

    // Transaction resources
    {
      resource: db.table('transactions'),
      options: {
        listProperties: ['id', 'transactionHash', 'transactionType', 'price', 'status', 'createdAt'],
        properties: {
          transactionType: {
            availableValues: [
              { label: 'Mint', value: 'mint' },
              { label: 'Sale', value: 'sale' },
              { label: 'Transfer', value: 'transfer' },
              { label: 'Deposit', value: 'deposit' },
              { label: 'Withdrawal', value: 'withdrawal' },
              { label: 'Purchase', value: 'purchase' },
            ],
          },
          status: {
            availableValues: [
              { label: 'Pending', value: 'pending' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Failed', value: 'failed' },
              { label: 'Completed', value: 'completed' },
            ],
          },
        },
      },
    },

    // Auction resources
    {
      resource: db.table('auctions'),
      options: {
        listProperties: ['id', 'nftItemId', 'type', 'status', 'startingPrice', 'startTime', 'endTime'],
        properties: {
          type: {
            availableValues: [
              { label: 'Standard', value: 'STANDARD' },
              { label: 'Reserve', value: 'RESERVE' },
              { label: 'Timed', value: 'TIMED' },
              { label: 'Dutch', value: 'DUTCH' },
              { label: 'Blind', value: 'BLIND' },
              { label: 'Lottery', value: 'LOTTERY' },
              { label: 'Buy Now', value: 'BUY_NOW' },
              { label: 'Multi Token', value: 'MULTI_TOKEN' },
            ],
          },
          status: {
            availableValues: [
              { label: 'Live', value: 'live' },
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Ended', value: 'ended' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        },
      },
    },
    {
      resource: db.table('bids'),
      options: {
        listProperties: ['id', 'auctionId', 'bidderId', 'amount', 'createdAt'],
      },
    },

    // Exhibition resources
    {
      resource: db.table('exhibitions'),
      options: {
        listProperties: ['id', 'title', 'status', 'startDate', 'endDate', 'featured', 'views'],
        properties: {
          status: {
            availableValues: [
              { label: 'Draft', value: 'draft' },
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Active', value: 'active' },
              { label: 'Ended', value: 'ended' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
          locationType: {
            availableValues: [
              { label: 'Virtual', value: 'virtual' },
              { label: 'Physical', value: 'physical' },
              { label: 'Hybrid', value: 'hybrid' },
            ],
          },
        },
      },
    },

    // Financial resources
    {
      resource: db.table('withdrawal_requests'),
      options: {
        listProperties: ['id', 'userId', 'status', 'destinationAddress', 'createdAt'],
        properties: {
          status: {
            availableValues: [
              { label: 'Pending', value: 'pending' },
              { label: 'Verified', value: 'verified' },
              { label: 'Processing', value: 'processing' },
              { label: 'Completed', value: 'completed' },
              { label: 'Failed', value: 'failed' },
            ],
          },
        },
      },
    },
    {
      resource: db.table('deposit_requests'),
      options: {
        listProperties: ['id', 'userId', 'amount', 'status', 'createdAt'],
        properties: {
          status: {
            availableValues: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Completed', value: 'completed' },
            ],
          },
        },
      },
    },

    // Platform wallets
    {
      resource: db.table('platform_wallets'),
      options: {
        listProperties: ['id', 'address', 'index', 'status', 'assignedAt'],
        properties: {
          status: {
            availableValues: [
              { label: 'Available', value: 'available' },
              { label: 'Assigned', value: 'assigned' },
              { label: 'Maintenance', value: 'maintenance' },
              { label: 'Disabled', value: 'disabled' },
            ],
          },
        },
      },
    },

    // Additional resources
    {
      resource: db.table('escrow_transactions'),
      options: {
        listProperties: ['id', 'nftItemId', 'buyerId', 'sellerId', 'amount', 'status', 'createdAt'],
      },
    },
    {
      resource: db.table('whitelisted_addresses'),
      options: {
        listProperties: ['id', 'userId', 'address', 'label', 'addedAt'],
      },
    },
    {
      resource: db.table('purchase_sessions'),
      options: {
        listProperties: ['id', 'userId', 'nftItemId', 'amount', 'status', 'expiresAt'],
      },
    },
  ],
  databases: [],
  branding: {
    companyName: 'Vaultorx NFT Marketplace Admin',
    logo: false,
  },
};

export default options;
