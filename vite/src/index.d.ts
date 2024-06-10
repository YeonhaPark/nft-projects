interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: ethers.ContractRunner;
}

interface OutletContext {
  mintContract: Contract;
  saleContract: Contract;
  signer: JsonRpcSigner;
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}
