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

    mapping(uint256 => address) public seller;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => address) public inspector;
    mapping(uint256 => address) public lender;

    mapping(uint256 => bool) public inspectionPassed;
    mapping(address => bool) public approval;

    receive() external payable {}

    ////////////////////////////////////////
    // Modifiers
    modifier mustBeListed(uint256 _nftID) {
        if (!isListed[_nftID]) {
            revert NotListedError("NFT is not listed");
        }
        _;
    }

    modifier onlySeller(string memory reason) {
        if (msg.sender != seller) {
            revert NotDesiredEntityError(reason, buyer, msg.sender);
        }
        _;
    }

    modifier onlyBuyer(uint256 _nftID, string memory reason) {
        if (msg.sender != buyer[_nftID]) {
            revert NotDesiredEntityError(reason, buyer[_nftID], msg.sender);
        }
        _;
    }

    modifier onlyInspector(uint256 _nftID, string memory reason) {
        if (msg.sender != inspector) {
            revert NotDesiredEntityError(reason, inspector, msg.sender);
        }
        _;
    }

    ////////////////////////////////////////
    // Errors
    error NotDesiredEntityError(string reason, uint256 _nftID, address desiredEntity, address providedEntity);
    error EarnestDepositError(string reason, uint256 _nftID, uint256 escrowAmount, uint256 providedAmount);
    error NotListedError(uint256 _nftID, string reason);
    error SaleError(uint256 _nftID, string reason);

    ////////////////////////////////////////
    // Events
    event InspectionEvent(
        uint256 when,
        uint256 indexed nftID,
        address indexed inspector,
        bool passed
    );

    event DepositedEarnestEvent(
        uint256 when,
        uint256 indexed nftID,
        address indexed buyer,
        uint256 amount
    );

    event ApprovedSaleByEvent(
        uint256 when,
        uint256 indexed nftID,
        address indexed approver
    );

    event SaleEvent(
        uint256 when,
        uint256 indexed nftID,
        address indexed seller,
        address buyer
    );

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
        realEstateNFTAddress = _realEstateNFTAddress
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
            revert NotDesiredEntityError("NFT already has a buyer", buyer[_nftID], msg.sender);
        }
        buyer[_nftID] = msg.sender;
    }

    // buyer deposits the earnest to the escrow
    function depositEarnest(
        uint256 _nftID
    ) public payable mustBeListed(_nftID) onlyBuyer(_nftID, "Only buyer can deposit earnest") {
        if (msg.value < escrowAmount[_nftID]) {
            revert EarnestDepositError("Insuficient funds provided", escrowAmount, msg.value);
        }
        emit DepositedEarnestEvent(block.timestamp, _nftID, msg.sender, msg.value);
    }

    ////////
    // INSPECTOR things

    // inspector is assigned to the NFT
    function meToInspector(uint256 _nftID) public mustBeListed(_nftID) {
        if (inspector[_nftID] != address(0)) {
            revert NotDesiredEntityError("NFT already has an inspector", inspector[_nftID], msg.sender);
        }
        inspector[_nftID] = msg.sender;
    }

    // inspector updates the inspection status
    function updateInspectionStatus(
        uint256 _nftID,
        bool _inspectionPassed
    ) public mustBeListed(_nftID) onlyInspector(_nftID, "Only inspector can update inspection status") {
        inspectionPassed[_nftID] = _inspectionPassed;
        emit InspectionEvent(block.timestamp, _nftID, inspector, inspectionPassed);
    }

    ////////
    // ALL parties things

    // approve the sale
    function approveSale(uint256 _nftID) public mustBeListed(_nftID) {
        approval[msg.sender] = true;
        emit ApprovedSaleByEvent(block.timestamp, _nftID, msg.sender);
    }

    function cancelSale(uint256 _nftID) public mustBeListed(_nftID) {
        if (inspectionPassed) payable(seller).transfer(address(this).balance);
        else payable(buyer).transfer(address(this).balance);
    }

    // transfer ownership of the NFT to the buyer
    function transactionSale(uint256 _nftID) public mustBeListed(_nftID) {
        if (!inspectionPassed) {
            revert SaleError("Inspection not passed yet");
        }
        if (!approval[buyer]) {
            revert SaleError("Buyer has not approved the sale yet");
        }
        if (!approval[seller]) {
            revert SaleError("Seller has not approved the sale yet");
        }
        if (!approval[lender]) {
            revert SaleError("Lender has not approved the sale yet");
        }
        if (address(this).balance < purchasePrice) {
            revert SaleError("Insuficient funds to complete the sale");
        }

        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        if (!success) {
            revert SaleError("Failed to transfer funds to the seller");
        }
        IERC721(nftAddress).transferFrom(address(this), buyer, nftID);
        emit SaleEvent(block.timestamp, _nftID, seller, buyer);
    }
}
