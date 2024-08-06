// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// solhint-disable-next-line no-global-import
import "./RealEstate.sol";

contract Escrow {
    ////////////////////////////////////////
    // Vars
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice; // value of the NFT Property
    uint256 public escrowAmount; // value of the escrow (buyer must deposit to do a escrow)
    address payable public seller;
    address payable public buyer;
    address public inspector; // addr of the inspector (who inspects the property)
    address public lender; // addr of the lender (who gives money to the buyer (loan))

    bool public inspectionPassed = false;
    mapping(address => bool) public approval;

    receive() external payable {}

    ////////////////////////////////////////
    // Modifiers
    modifier onlyBuyer(string memory reason) {
        if (msg.sender != buyer) {
            revert NotDesiredEntityError(reason, buyer, msg.sender);
        }
        _;
    }

    modifier onlyInspector(string memory reason) {
        if (msg.sender != inspector) {
            revert NotDesiredEntityError(reason, inspector, msg.sender);
        }
        _;
    }

    ////////////////////////////////////////
    // Errors
    error NotDesiredEntityError(string reason, address desiredEntity, address providedEntity);
    error EarnestDepositError(string reason, uint256 escrowAmount, uint256 providedAmount);
    error SaleError(string reason);

    ////////////////////////////////////////
    // Events
    event InspectionEvent(
        uint256 when,
        address indexed nftAddress,
        uint256 indexed nftID,
        address indexed inspector,
        bool passed
    );

    event DepositedEarnestEvent(
        uint256 when,
        address indexed nftAddress,
        uint256 indexed nftID,
        address indexed buyer,
        uint256 amount
    );

    event ApprovedSaleByEvent(
        uint256 when,
        address indexed nftAddress,
        uint256 indexed nftID,
        address indexed approver
    );

    event SaleEvent(
        uint256 when,
        address indexed nftAddress,
        uint256 indexed nftID,
        address indexed seller,
        address buyer
    );

    ////////////////////////////////////////
    // Constructor
    constructor(
        address _nftAddress,
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        inspector = _inspector;
        lender = _lender;
    }

    ////////////////////////////////////////
    // Methods

    // buyer deposits the earnest to the escrow
    function depositEarnest() public payable onlyBuyer("Only buyer can deposit earnest") {
        if (msg.value < escrowAmount) {
            revert EarnestDepositError("Insuficient funds provided", escrowAmount, msg.value);
        }
        emit DepositedEarnestEvent(block.timestamp, nftAddress, nftID, msg.sender, msg.value);
    }

    // inspector updates the inspection status
    function updateInspectionStatus(
        bool _inspectionPassed
    ) public onlyInspector("Only inspector can update inspection status") {
        inspectionPassed = _inspectionPassed;
        emit InspectionEvent(block.timestamp, nftAddress, nftID, inspector, inspectionPassed);
    }

    // get the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // approve the sale
    function approveSale() public {
        approval[msg.sender] = true;
        emit ApprovedSaleByEvent(block.timestamp, nftAddress, nftID, msg.sender);
    }

    function cancelSale() public {
        if (inspectionPassed) payable(seller).transfer(address(this).balance);
        else payable(buyer).transfer(address(this).balance);
    }

    // transfer ownership of the NFT to the buyer
    function transactionSale() public {
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
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
        emit SaleEvent(block.timestamp, nftAddress, nftID, seller, buyer);
    }
}
