import { Flex, Grid, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SaleNftCard from "../components/SaleNftCard";

const SaleNft: FC = () => {
  const { signer, mintContract, saleContract } =
    useOutletContext<OutletContext>();

  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const getOnSaleTokens = async () => {
    try {
      const response = await saleContract.getOnSaleTokens();
      setTokenIds(response.map((el: bigint) => Number(el)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!saleContract) return;
    getOnSaleTokens();
  }, [saleContract, signer]);

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
          {tokenIds.map((tokenId) => (
            <SaleNftCard
              key={tokenId}
              tokenId={tokenId}
              mintContract={mintContract}
              saleContract={saleContract}
              setTokenIds={setTokenIds}
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
