/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  RealEstate_ABI,
  RealEstate_ABIInterface,
} from "../RealEstate_ABI";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC721EnumerableForbiddenBatchMint",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "ERC721OutOfBoundsIndex",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001cf138038062001cf183398101604081905262000034916200012a565b806040518060400160405280600a8152602001695265616c45737461746560b01b81525060405180604001604052806002815260200161524560f01b815250816000908162000084919062000201565b50600162000093828262000201565b5050506001600160a01b038116620000c557604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b620000d081620000d8565b5050620002cd565b600b80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000602082840312156200013d57600080fd5b81516001600160a01b03811681146200015557600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200018757607f821691505b602082108103620001a857634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001fc57600081815260208120601f850160051c81016020861015620001d75750805b601f850160051c820191505b81811015620001f857828155600101620001e3565b5050505b505050565b81516001600160401b038111156200021d576200021d6200015c565b62000235816200022e845462000172565b84620001ae565b602080601f8311600181146200026d5760008415620002545750858301515b600019600386901b1c1916600185901b178555620001f8565b600085815260208120601f198616915b828110156200029e578886015182559484019460019091019084016200027d565b5085821015620002bd5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b611a1480620002dd6000396000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c806370a08231116100cd578063b88d4fde11610081578063d204c45e11610066578063d204c45e146102cc578063e985e9c5146102df578063f2fde38b1461031b57600080fd5b8063b88d4fde146102a6578063c87b56dd146102b957600080fd5b80638da5cb5b116100b25780638da5cb5b1461027a57806395d89b411461028b578063a22cb4651461029357600080fd5b806370a082311461025f578063715018a61461027257600080fd5b806323b872dd1161012457806342842e0e1161010957806342842e0e146102265780634f6ccce7146102395780636352211e1461024c57600080fd5b806323b872dd146102005780632f745c591461021357600080fd5b8063081812fc11610155578063081812fc146101ae578063095ea7b3146101d957806318160ddd146101ee57600080fd5b806301ffc9a71461017157806306fdde0314610199575b600080fd5b61018461017f366004611491565b61032e565b60405190151581526020015b60405180910390f35b6101a161033f565b60405161019091906114fe565b6101c16101bc366004611511565b6103d1565b6040516001600160a01b039091168152602001610190565b6101ec6101e7366004611546565b6103fa565b005b6008545b604051908152602001610190565b6101ec61020e366004611570565b610409565b6101f2610221366004611546565b6104b2565b6101ec610234366004611570565b610517565b6101f2610247366004611511565b610537565b6101c161025a366004611511565b610590565b6101f261026d3660046115ac565b61059b565b6101ec6105fc565b600b546001600160a01b03166101c1565b6101a1610610565b6101ec6102a13660046115c7565b61061f565b6101ec6102b436600461168f565b61062a565b6101a16102c7366004611511565b610641565b6101ec6102da36600461170b565b61064c565b6101846102ed36600461176d565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6101ec6103293660046115ac565b61067f565b6000610339826106d6565b92915050565b60606000805461034e906117a0565b80601f016020809104026020016040519081016040528092919081815260200182805461037a906117a0565b80156103c75780601f1061039c576101008083540402835291602001916103c7565b820191906000526020600020905b8154815290600101906020018083116103aa57829003601f168201915b5050505050905090565b60006103dc82610714565b506000828152600460205260409020546001600160a01b0316610339565b61040582823361074d565b5050565b6001600160a01b03821661043857604051633250574960e11b8152600060048201526024015b60405180910390fd5b600061044583833361075a565b9050836001600160a01b0316816001600160a01b0316146104ac576040517f64283d7b0000000000000000000000000000000000000000000000000000000081526001600160a01b038086166004830152602482018490528216604482015260640161042f565b50505050565b60006104bd8361059b565b82106104ee5760405163295f44f760e21b81526001600160a01b03841660048201526024810183905260440161042f565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b6105328383836040518060200160405280600081525061062a565b505050565b600061054260085490565b821061056b5760405163295f44f760e21b8152600060048201526024810183905260440161042f565b6008828154811061057e5761057e6117da565b90600052602060002001549050919050565b600061033982610714565b60006001600160a01b0382166105e0576040517f89c62b640000000000000000000000000000000000000000000000000000000081526000600482015260240161042f565b506001600160a01b031660009081526003602052604090205490565b61060461076f565b61060e60006107b5565b565b60606001805461034e906117a0565b610405338383610814565b610635848484610409565b6104ac848484846108cc565b6060610339826109f5565b61065461076f565b600c80546000918261066583611806565b9190505590506106758382610afe565b6105328183610b18565b61068761076f565b6001600160a01b0381166106ca576040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526000600482015260240161042f565b6106d3816107b5565b50565b60006001600160e01b031982167f49064906000000000000000000000000000000000000000000000000000000001480610339575061033982610b68565b6000818152600260205260408120546001600160a01b03168061033957604051637e27328960e01b81526004810184905260240161042f565b6105328383836001610ba6565b6000610767848484610cf1565b949350505050565b600b546001600160a01b0316331461060e576040517f118cdaa700000000000000000000000000000000000000000000000000000000815233600482015260240161042f565b600b80546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b03821661085f576040517f5b08ba180000000000000000000000000000000000000000000000000000000081526001600160a01b038316600482015260240161042f565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b156104ac57604051630a85bd0160e11b81526001600160a01b0384169063150b7a029061090e90339088908790879060040161181f565b6020604051808303816000875af1925050508015610949575060408051601f3d908101601f191682019092526109469181019061185b565b60015b6109b2573d808015610977576040519150601f19603f3d011682016040523d82523d6000602084013e61097c565b606091505b5080516000036109aa57604051633250574960e11b81526001600160a01b038516600482015260240161042f565b805181602001fd5b6001600160e01b03198116630a85bd0160e11b146109ee57604051633250574960e11b81526001600160a01b038516600482015260240161042f565b5050505050565b6060610a0082610714565b506000828152600a602052604081208054610a1a906117a0565b80601f0160208091040260200160405190810160405280929190818152602001828054610a46906117a0565b8015610a935780601f10610a6857610100808354040283529160200191610a93565b820191906000526020600020905b815481529060010190602001808311610a7657829003601f168201915b505050505090506000610ab160408051602081019091526000815290565b90508051600003610ac3575092915050565b815115610af5578082604051602001610add929190611878565b60405160208183030381529060405292505050919050565b61076784610dbe565b610405828260405180602001604052806000815250610e33565b6000828152600a60205260409020610b3082826118f5565b506040518281527ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce79060200160405180910390a15050565b60006001600160e01b031982167f780e9d63000000000000000000000000000000000000000000000000000000001480610339575061033982610e4a565b8080610bba57506001600160a01b03821615155b15610cb4576000610bca84610714565b90506001600160a01b03831615801590610bf65750826001600160a01b0316816001600160a01b031614155b8015610c2857506001600160a01b0380821660009081526005602090815260408083209387168352929052205460ff16155b15610c6a576040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526001600160a01b038416600482015260240161042f565b8115610cb25783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b50506000908152600460205260409020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b600080610cff858585610ee5565b90506001600160a01b038116610d5c57610d5784600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b610d7f565b846001600160a01b0316816001600160a01b031614610d7f57610d7f8185610feb565b6001600160a01b038516610d9b57610d968461107c565b610767565b846001600160a01b0316816001600160a01b03161461076757610767858561112b565b6060610dc982610714565b506000610de160408051602081019091526000815290565b90506000815111610e015760405180602001604052806000815250610e2c565b80610e0b8461117b565b604051602001610e1c929190611878565b6040516020818303038152906040525b9392505050565b610e3d838361121b565b61053260008484846108cc565b60006001600160e01b031982167f80ac58cd000000000000000000000000000000000000000000000000000000001480610ead57506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b8061033957507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b0319831614610339565b6000828152600260205260408120546001600160a01b0390811690831615610f1257610f12818486611299565b6001600160a01b03811615610f5057610f2f600085600080610ba6565b6001600160a01b038116600090815260036020526040902080546000190190555b6001600160a01b03851615610f7f576001600160a01b0385166000908152600360205260409020805460010190555b600084815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b6000610ff68361059b565b600083815260076020526040902054909150808214611049576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b60085460009061108e906001906119b5565b600083815260096020526040812054600880549394509092849081106110b6576110b66117da565b9060005260206000200154905080600883815481106110d7576110d76117da565b600091825260208083209091019290925582815260099091526040808220849055858252812055600880548061110f5761110f6119c8565b6001900381819060005260206000200160009055905550505050565b600060016111388461059b565b61114291906119b5565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b6060600061118883611316565b600101905060008167ffffffffffffffff8111156111a8576111a8611603565b6040519080825280601f01601f1916602001820160405280156111d2576020820181803683370190505b5090508181016020015b600019017f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a85049450846111dc57509392505050565b6001600160a01b03821661124557604051633250574960e11b81526000600482015260240161042f565b60006112538383600061075a565b90506001600160a01b03811615610532576040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526000600482015260240161042f565b6112a48383836113f8565b610532576001600160a01b0383166112d257604051637e27328960e01b81526004810182905260240161042f565b6040517f177e802f0000000000000000000000000000000000000000000000000000000081526001600160a01b03831660048201526024810182905260440161042f565b6000807a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000831061135f577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000830492506040015b6d04ee2d6d415b85acef8100000000831061138b576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc1000083106113a957662386f26fc10000830492506010015b6305f5e10083106113c1576305f5e100830492506008015b61271083106113d557612710830492506004015b606483106113e7576064830492506002015b600a83106103395760010192915050565b60006001600160a01b038316158015906107675750826001600160a01b0316846001600160a01b0316148061145257506001600160a01b0380851660009081526005602090815260408083209387168352929052205460ff165b806107675750506000908152600460205260409020546001600160a01b03908116911614919050565b6001600160e01b0319811681146106d357600080fd5b6000602082840312156114a357600080fd5b8135610e2c8161147b565b60005b838110156114c95781810151838201526020016114b1565b50506000910152565b600081518084526114ea8160208601602086016114ae565b601f01601f19169290920160200192915050565b602081526000610e2c60208301846114d2565b60006020828403121561152357600080fd5b5035919050565b80356001600160a01b038116811461154157600080fd5b919050565b6000806040838503121561155957600080fd5b6115628361152a565b946020939093013593505050565b60008060006060848603121561158557600080fd5b61158e8461152a565b925061159c6020850161152a565b9150604084013590509250925092565b6000602082840312156115be57600080fd5b610e2c8261152a565b600080604083850312156115da57600080fd5b6115e38361152a565b9150602083013580151581146115f857600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561163457611634611603565b604051601f8501601f19908116603f0116810190828211818310171561165c5761165c611603565b8160405280935085815286868601111561167557600080fd5b858560208301376000602087830101525050509392505050565b600080600080608085870312156116a557600080fd5b6116ae8561152a565b93506116bc6020860161152a565b925060408501359150606085013567ffffffffffffffff8111156116df57600080fd5b8501601f810187136116f057600080fd5b6116ff87823560208401611619565b91505092959194509250565b6000806040838503121561171e57600080fd5b6117278361152a565b9150602083013567ffffffffffffffff81111561174357600080fd5b8301601f8101851361175457600080fd5b61176385823560208401611619565b9150509250929050565b6000806040838503121561178057600080fd5b6117898361152a565b91506117976020840161152a565b90509250929050565b600181811c908216806117b457607f821691505b6020821081036117d457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611818576118186117f0565b5060010190565b60006001600160a01b0380871683528086166020840152508360408301526080606083015261185160808301846114d2565b9695505050505050565b60006020828403121561186d57600080fd5b8151610e2c8161147b565b6000835161188a8184602088016114ae565b83519083019061189e8183602088016114ae565b01949350505050565b601f82111561053257600081815260208120601f850160051c810160208610156118ce5750805b601f850160051c820191505b818110156118ed578281556001016118da565b505050505050565b815167ffffffffffffffff81111561190f5761190f611603565b6119238161191d84546117a0565b846118a7565b602080601f83116001811461195857600084156119405750858301515b600019600386901b1c1916600185901b1785556118ed565b600085815260208120601f198616915b8281101561198757888601518255948401946001909101908401611968565b50858210156119a55787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b81810381811115610339576103396117f0565b634e487b7160e01b600052603160045260246000fdfea264697066735822122077df4035f21e5da10febbca4c4d98cbfedc9e298c714bfe8607b0c9f6dfac34064736f6c63430008140033";

type RealEstate_ABIConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RealEstate_ABIConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RealEstate_ABI__factory extends ContractFactory {
  constructor(...args: RealEstate_ABIConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(initialOwner, overrides || {});
  }
  override deploy(
    initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(initialOwner, overrides || {}) as Promise<
      RealEstate_ABI & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): RealEstate_ABI__factory {
    return super.connect(runner) as RealEstate_ABI__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RealEstate_ABIInterface {
    return new Interface(_abi) as RealEstate_ABIInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RealEstate_ABI {
    return new Contract(address, _abi, runner) as unknown as RealEstate_ABI;
  }
}
