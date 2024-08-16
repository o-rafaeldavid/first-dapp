// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// solhint-disable-next-line no-global-import
import "./RealEstate.sol";

contract Escrow {
    ////////////////////////////////////////
    // Vars
    address public realEstateNFTAddress;

    // (nftID => info of the NFT Property listed)
    mapping(uint256 => bool) public isListed; // check if the NFT is listed
    mapping(uint256 => uint256) public purchasePrice; // value of the NFT Property
    mapping(uint256 => uint256) public escrowAmount; // value of the escrow (buyer must deposit to do a escrow)
    mapping(uint256 => uint256) public depositedAmount; // value of the escrow (buyer must deposit to do a escrow)
    mapping(uint256 => uint256) public depositByBuyer; // money given by buyer
    mapping(uint256 => uint256) public depositByLender; // money given by lender

    mapping(uint256 => address) public seller;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => address) public inspector;
    mapping(uint256 => address) public lender;

    mapping(uint256 => bool) public withEscrow; // check if the NFT is listed with escrow value

    mapping(uint256 => bool) public inspectionPassed; // check if the inspection passed
    mapping(address => bool) public approval; // check if the party approved the sale

    receive() external payable {}

    ////////////////////////////////////////
    // Modifiers
    modifier mustBeListed(uint256 _nftID) {
        if (!isListed[_nftID]) {
            revert NotListedError(_nftID, "NFT is not listed");
        }
        _;
    }

    modifier mustBeWithEscrow(uint256 _nftID) {
        if (!withEscrow[_nftID]) {
            revert WithoutEscrowError(_nftID, "NFT is not with escrow value (buyer must deposit to do a escrow)");
        }
        _;
    }

    modifier mustBeInspectionPassed(uint256 _nftID) {
        if (!inspectionPassed[_nftID]) {
            revert InspectionPassedError(_nftID, "Inspection not passed yet");
        }
        _;
    }

    modifier onlySeller(uint256 _nftID, string memory reason) {
        if (msg.sender != seller[_nftID]) {
            revert NotDesiredEntityError(reason, _nftID, buyer[_nftID], msg.sender);
        }
        _;
    }

    modifier onlyBuyer(uint256 _nftID, string memory reason) {
        if (msg.sender != buyer[_nftID]) {
            revert NotDesiredEntityError(reason, _nftID, buyer[_nftID], msg.sender);
        }
        _;
    }

    modifier onlyLender(uint256 _nftID, string memory reason) {
        if (msg.sender != lender[_nftID]) {
            revert NotDesiredEntityError(reason, _nftID, lender[_nftID], msg.sender);
        }
        _;
    }

    modifier onlyInspector(uint256 _nftID, string memory reason) {
        if (msg.sender != inspector[_nftID]) {
            revert NotDesiredEntityError(reason, _nftID, inspector[_nftID], msg.sender);
        }
        _;
    }

    ////////////////////////////////////////
    // Errors
    error NotDesiredEntityError(string reason, uint256 _nftID, address desiredEntity, address providedEntity);
    error EarnestDepositError(string reason, uint256 _nftID, uint256 escrowAmount, uint256 providedAmount);
    error NotListedError(uint256 _nftID, string reason);
    error WithoutEscrowError(uint256 _nftID, string reason);
    error InspectionPassedError(uint256 _nftID, string reason);
    error SaleError(uint256 _nftID, string reason);

    ////////////////////////////////////////
    // Events
    event InspectionEvent(uint256 when, uint256 indexed nftID, address indexed inspector, bool passed);

    event DepositedEarnestEvent(uint256 when, uint256 indexed nftID, address indexed buyer, uint256 amount);

    event ApprovedSaleByEvent(uint256 when, uint256 indexed nftID, address indexed approver);

    event SaleEvent(uint256 when, uint256 indexed nftID, address indexed seller, address buyer);

    event ListEvent(
        uint256 when,
        uint256 indexed nftID,
        address indexed seller,
        uint256 purchasePrice,
        uint256 escrowAmount
    );

    ////////////////////////////////////////
    // Constructor
    constructor(address _realEstateNFTAddress) {
        realEstateNFTAddress = _realEstateNFTAddress;
    }

    ////////////////////////////////////////
    // Methods

    // get the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    ////////
    // SELLER things

    // list nft to be sold
    function list(uint256 _nftID, uint256 _purchasePrice, uint256 _escrowAmount) public payable {
        IERC721(realEstateNFTAddress).transferFrom(msg.sender, address(this), _nftID);
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        seller[_nftID] = msg.sender;
        inspectionPassed[_nftID] = false;
        emit ListEvent(block.timestamp, _nftID, msg.sender, _purchasePrice, _escrowAmount);
    }

    ////////
    // BUYER things

    // buyer is assigned to the NFT
    function meToBuyer(uint256 _nftID) public mustBeListed(_nftID) {
        if (buyer[_nftID] != address(0)) {
            revert NotDesiredEntityError("NFT already has a buyer", _nftID, buyer[_nftID], msg.sender);
        }
        buyer[_nftID] = msg.sender;
    }

    // buyer deposits for the NFT (must deposit an earnest)
    function deposit(
        uint256 _nftID
    ) public payable mustBeListed(_nftID) onlyBuyer(_nftID, "Only buyer can deposit earnest") {
        /**
         * if the buyer (interested) is depositing for the first time
         *** then must deposit the escrow amount
         *
         * if the buyer (interested) is depositing more after the first time, then can deposit any amount
         */
        if (depositedAmount[_nftID] < escrowAmount[_nftID]) {
            if (msg.value < escrowAmount[_nftID])
                revert EarnestDepositError("Insuficient funds provided", _nftID, escrowAmount[_nftID], msg.value);

            withEscrow[_nftID] = true;
        }
        depositedAmount[_nftID] += msg.value;
        depositByBuyer[_nftID] += msg.value;
        emit DepositedEarnestEvent(block.timestamp, _nftID, msg.sender, msg.value);
    }

    ////////
    // INSPECTOR things

    // inspector is assigned to the NFT
    function meToInspector(uint256 _nftID) public mustBeListed(_nftID) {
        if (inspector[_nftID] != address(0)) {
            revert NotDesiredEntityError("NFT already has an inspector", _nftID, inspector[_nftID], msg.sender);
        }
        inspector[_nftID] = msg.sender;
    }

    // inspector updates the inspection status
    function updateInspectionStatus(
        uint256 _nftID,
        bool _inspectionPassed
    ) public mustBeListed(_nftID) onlyInspector(_nftID, "Only inspector can update inspection status") {
        inspectionPassed[_nftID] = _inspectionPassed;
        emit InspectionEvent(block.timestamp, _nftID, inspector[_nftID], _inspectionPassed);
    }

    ////////
    // LENDER things

    /**
     * to be a lender on a sell the NFT must be listed and:
     *** 1. the NFT must not have a lender yet
     *** 2. the NFT must have a buyer
     *** 3. the NFT must have passed the inspection
     */

    function meToLend(uint256 _nftID) public mustBeListed(_nftID) mustBeInspectionPassed(_nftID) {
        if (lender[_nftID] != address(0)) {
            revert NotDesiredEntityError("NFT already has a lender", _nftID, lender[_nftID], msg.sender);
        }
        lender[_nftID] = msg.sender;
    }

    function lend(
        uint256 _nftID
    )
        public
        payable
        mustBeListed(_nftID)
        mustBeWithEscrow(_nftID)
        mustBeInspectionPassed(_nftID)
        onlyLender(_nftID, "Only lender can lend")
    {
        depositByLender[_nftID] += msg.value;
    }

    ////////
    // ALL parties things

    // approve the sale
    function approveSale(uint256 _nftID) public mustBeListed(_nftID) {
        approval[msg.sender] = true;
        emit ApprovedSaleByEvent(block.timestamp, _nftID, msg.sender);
    }

    /* function cancelSale(uint256 _nftID) public mustBeListed(_nftID) {
        if (inspectionPassed) payable(seller[_nftID]).transfer(address(this).balance);
        else payable(buyer[_nftID]).transfer(address(this).balance);
    } */

    // transfer ownership of the NFT to the buyer
    function transactionSale(uint256 _nftID) public mustBeListed(_nftID) {
        if (!inspectionPassed[_nftID]) {
            revert SaleError(_nftID, "Inspection not passed yet");
        }
        if (!approval[buyer[_nftID]]) {
            revert SaleError(_nftID, "Buyer has not approved the sale yet");
        }
        if (!approval[seller[_nftID]]) {
            revert SaleError(_nftID, "Seller has not approved the sale yet");
        }
        /* if (!approval[lender[_nftID]]) {
            revert SaleError(_nftID, "Lender has not approved the sale yet");
        } */
        if (address(this).balance < purchasePrice[_nftID]) {
            revert SaleError(_nftID, "Insuficient funds to complete the sale");
        }

        (bool success, ) = payable(seller[_nftID]).call{value: address(this).balance}("");
        if (!success) {
            revert SaleError(_nftID, "Failed to transfer funds to the seller");
        }
        IERC721(realEstateNFTAddress).transferFrom(address(this), buyer[_nftID], _nftID);
        emit SaleEvent(block.timestamp, _nftID, seller[_nftID], buyer[_nftID]);
    }
}
