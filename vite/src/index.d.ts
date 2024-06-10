interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
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
interface SaleNftMetadata {
  price: bigint;
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}
