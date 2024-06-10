import { Flex, Grid, Text } from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SaleNftCard from "../components/SaleNftCard";

const SaleNft: FC = () => {
  const { signer, mintContract, saleContract } =
    useOutletContext<OutletContext>();
  const [nftMetadataArray, setNftMetadataArray] = useState<SaleNftMetadata[]>(
    []
  );
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const getOnSaleTokens = async () => {
    try {
      const response = await saleContract.getOnSaleTokens();
      setTokenIds(response.map((el: bigint) => Number(el)));
    } catch (e) {
      console.error(e);
    }
  };
  const getNftMetadata = async () => {
    try {
      const temp = await Promise.all(
        tokenIds.map(async (v) => {
          const tokenURI = await mintContract.tokenURI(v);
          const price = await saleContract.getTokenPrice(v);
          const response = await axios.get(tokenURI);
          return { ...response.data, price };
        })
      );

      setNftMetadataArray(temp);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (!saleContract) return;
    getOnSaleTokens();
  }, [saleContract]);

  useEffect(() => {
    if (tokenIds.length === 0) return;
    getNftMetadata();
  }, [tokenIds]);

  useEffect(() => console.log(tokenIds), [tokenIds]);
  return (
    <Flex w="100%" flexDir={"column"} mt={8} mb={20}>
      {signer ? (
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
          ]}
          gap={6}
        >
          {nftMetadataArray.map((metadata, i) => (
            <SaleNftCard
              key={metadata.name}
              nftMetadata={metadata}
              tokenId={tokenIds[i]}
              mintContract={mintContract}
              saleContract={saleContract}
              setNftMetadataArray={setNftMetadataArray}
              signer={signer}
            />
          ))}
        </Grid>
      ) : (
        <Text>🦊메타마스크 로그인이 필요합니다!</Text>
      )}
    </Flex>
  );
};

export default SaleNft;
