// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract PrivatePayDAO is SepoliaConfig {
    using FHE for *;
    
    struct Contributor {
        euint32 contributorId;
        euint32 totalContributions;
        euint32 reputation;
        euint32 pendingRewards;
        bool isActive;
        address walletAddress;
        string name;
        uint256 joinDate;
    }
    
    struct Contribution {
        euint32 contributionId;
        euint32 amount;
        euint32 category;
        string description;
        address contributor;
        uint256 timestamp;
        bool isVerified;
    }
    
    struct Reward {
        euint32 rewardId;
        euint32 amount;
        euint32 contributionId;
        address recipient;
        uint256 timestamp;
        bool isClaimed;
    }
    
    struct TreasuryTransaction {
        euint32 transactionId;
        euint32 amount;
        string description;
        address from;
        address to;
        uint256 timestamp;
        bool isApproved;
    }
    
    mapping(uint256 => Contributor) public contributors;
    mapping(uint256 => Contribution) public contributions;
    mapping(uint256 => Reward) public rewards;
    mapping(uint256 => TreasuryTransaction) public treasuryTransactions;
    mapping(address => uint256) public contributorAddressToId;
    
    uint256 public contributorCounter;
    uint256 public contributionCounter;
    uint256 public rewardCounter;
    uint256 public treasuryTransactionCounter;
    
    address public owner;
    address public verifier;
    euint32 public totalTreasury;
    euint32 public totalDistributed;
    
    event ContributorAdded(uint256 indexed contributorId, address indexed walletAddress, string name);
    event ContributionAdded(uint256 indexed contributionId, address indexed contributor, string description);
    event RewardCreated(uint256 indexed rewardId, uint256 indexed contributionId, address indexed recipient);
    event RewardClaimed(uint256 indexed rewardId, address indexed recipient);
    event TreasuryTransactionCreated(uint256 indexed transactionId, address indexed from, address indexed to);
    event TreasuryTransactionApproved(uint256 indexed transactionId, bool isApproved);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
        totalTreasury = FHE.asEuint32(0);
        totalDistributed = FHE.asEuint32(0);
    }
    
    function addContributor(
        string memory _name,
        address _walletAddress
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_walletAddress != address(0), "Invalid wallet address");
        require(contributorAddressToId[_walletAddress] == 0, "Contributor already exists");
        
        uint256 contributorId = contributorCounter++;
        
        contributors[contributorId] = Contributor({
            contributorId: FHE.asEuint32(0), // Will be set properly later
            totalContributions: FHE.asEuint32(0),
            reputation: FHE.asEuint32(100), // Starting reputation
            pendingRewards: FHE.asEuint32(0),
            isActive: true,
            walletAddress: _walletAddress,
            name: _name,
            joinDate: block.timestamp
        });
        
        contributorAddressToId[_walletAddress] = contributorId;
        
        emit ContributorAdded(contributorId, _walletAddress, _name);
        return contributorId;
    }
    
    function addContribution(
        externalEuint32 amount,
        externalEuint32 category,
        string memory description,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(contributorAddressToId[msg.sender] > 0, "Contributor not registered");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        uint256 contributionId = contributionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalCategory = FHE.fromExternal(category, inputProof);
        
        contributions[contributionId] = Contribution({
            contributionId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            category: internalCategory,
            description: description,
            contributor: msg.sender,
            timestamp: block.timestamp,
            isVerified: false
        });
        
        // Update contributor's total contributions
        uint256 contributorId = contributorAddressToId[msg.sender];
        contributors[contributorId].totalContributions = FHE.add(
            contributors[contributorId].totalContributions, 
            internalAmount
        );
        
        emit ContributionAdded(contributionId, msg.sender, description);
        return contributionId;
    }
    
    function verifyContribution(uint256 contributionId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify contributions");
        require(contributions[contributionId].contributor != address(0), "Contribution does not exist");
        
        contributions[contributionId].isVerified = isVerified;
    }
    
    function createReward(
        uint256 contributionId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(msg.sender == verifier, "Only verifier can create rewards");
        require(contributions[contributionId].contributor != address(0), "Contribution does not exist");
        require(contributions[contributionId].isVerified, "Contribution must be verified");
        
        uint256 rewardId = rewardCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        rewards[rewardId] = Reward({
            rewardId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            contributionId: FHE.asEuint32(contributionId),
            recipient: contributions[contributionId].contributor,
            timestamp: block.timestamp,
            isClaimed: false
        });
        
        // Update contributor's pending rewards
        uint256 contributorId = contributorAddressToId[contributions[contributionId].contributor];
        contributors[contributorId].pendingRewards = FHE.add(
            contributors[contributorId].pendingRewards,
            internalAmount
        );
        
        emit RewardCreated(rewardId, contributionId, contributions[contributionId].contributor);
        return rewardId;
    }
    
    function claimReward(uint256 rewardId) public {
        require(rewards[rewardId].recipient == msg.sender, "Only recipient can claim reward");
        require(!rewards[rewardId].isClaimed, "Reward already claimed");
        
        rewards[rewardId].isClaimed = true;
        
        // Update contributor's pending rewards
        uint256 contributorId = contributorAddressToId[msg.sender];
        contributors[contributorId].pendingRewards = FHE.sub(
            contributors[contributorId].pendingRewards,
            rewards[rewardId].amount
        );
        
        // Update total distributed
        totalDistributed = FHE.add(totalDistributed, rewards[rewardId].amount);
        
        emit RewardClaimed(rewardId, msg.sender);
    }
    
    function createTreasuryTransaction(
        externalEuint32 amount,
        string memory description,
        address to,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(msg.sender == owner || msg.sender == verifier, "Only owner or verifier can create treasury transactions");
        require(to != address(0), "Invalid recipient address");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        uint256 transactionId = treasuryTransactionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        treasuryTransactions[transactionId] = TreasuryTransaction({
            transactionId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            description: description,
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            isApproved: false
        });
        
        emit TreasuryTransactionCreated(transactionId, msg.sender, to);
        return transactionId;
    }
    
    function approveTreasuryTransaction(uint256 transactionId, bool isApproved) public {
        require(msg.sender == owner, "Only owner can approve treasury transactions");
        require(treasuryTransactions[transactionId].from != address(0), "Transaction does not exist");
        
        treasuryTransactions[transactionId].isApproved = isApproved;
        
        if (isApproved) {
            // Update treasury total
            totalTreasury = FHE.sub(totalTreasury, treasuryTransactions[transactionId].amount);
        }
        
        emit TreasuryTransactionApproved(transactionId, isApproved);
    }
    
    function updateReputation(address contributor, euint32 newReputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(contributorAddressToId[contributor] > 0, "Contributor not found");
        
        uint256 contributorId = contributorAddressToId[contributor];
        contributors[contributorId].reputation = newReputation;
    }
    
    function getContributorInfo(uint256 contributorId) public view returns (
        string memory name,
        address walletAddress,
        uint8 totalContributions,
        uint8 reputation,
        uint8 pendingRewards,
        bool isActive,
        uint256 joinDate
    ) {
        Contributor storage contributor = contributors[contributorId];
        return (
            contributor.name,
            contributor.walletAddress,
            0, // FHE.decrypt(contributor.totalContributions) - will be decrypted off-chain
            0, // FHE.decrypt(contributor.reputation) - will be decrypted off-chain
            0, // FHE.decrypt(contributor.pendingRewards) - will be decrypted off-chain
            contributor.isActive,
            contributor.joinDate
        );
    }
    
    function getContributionInfo(uint256 contributionId) public view returns (
        uint8 amount,
        uint8 category,
        string memory description,
        address contributor,
        uint256 timestamp,
        bool isVerified
    ) {
        Contribution storage contribution = contributions[contributionId];
        return (
            0, // FHE.decrypt(contribution.amount) - will be decrypted off-chain
            0, // FHE.decrypt(contribution.category) - will be decrypted off-chain
            contribution.description,
            contribution.contributor,
            contribution.timestamp,
            contribution.isVerified
        );
    }
    
    function getRewardInfo(uint256 rewardId) public view returns (
        uint8 amount,
        uint8 contributionId,
        address recipient,
        uint256 timestamp,
        bool isClaimed
    ) {
        Reward storage reward = rewards[rewardId];
        return (
            0, // FHE.decrypt(reward.amount) - will be decrypted off-chain
            0, // FHE.decrypt(reward.contributionId) - will be decrypted off-chain
            reward.recipient,
            reward.timestamp,
            reward.isClaimed
        );
    }
    
    function getTreasuryInfo() public view returns (
        uint8 totalTreasuryAmount,
        uint8 totalDistributedAmount
    ) {
        return (
            0, // FHE.decrypt(totalTreasury) - will be decrypted off-chain
            0  // FHE.decrypt(totalDistributed) - will be decrypted off-chain
        );
    }
    
    function depositToTreasury() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        // In a real implementation, this would update the encrypted treasury total
        // For now, we'll just accept the ETH deposit
    }
    
    function withdrawFromTreasury(uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw from treasury");
        require(address(this).balance >= amount, "Insufficient treasury balance");
        
        payable(msg.sender).transfer(amount);
    }
}
