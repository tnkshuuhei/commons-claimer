const address = "0xB05Ca5772a54E5Aa81400b8E207368336187A1bB";

const abi = [
  {
    type: "constructor",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_eas", type: "address", internalType: "address" },
      {
        name: "_schemaRegistry",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "eas",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IEAS" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "praiseWithTip",
    inputs: [
      { name: "_praise", type: "string", internalType: "string" },
      { name: "_from", type: "address", internalType: "address" },
      { name: "_to", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "attestationUID",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolver",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract AttesterResolver",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "schemaRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ISchemaRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "schemaUID",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20Metadata",
      },
    ],
    stateMutability: "view",
  },
] as const;

export const praiseConfig = {
  address: address,
  abi: abi,
};
