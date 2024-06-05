import { FC } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftMetadata: NftMetadata;
}
const MintModal: FC<MintModalProps> = ({ isOpen, onClose, nftMetadata }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>민팅 성공</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Image
              w={60}
              h={60}
              src={nftMetadata.image}
              alt={nftMetadata.name}
            />
            <Text mt={4} fontSize={24} fontWeight={"semibold"}>
              {nftMetadata.name}
            </Text>
            <Text mt={4}>{nftMetadata.description}</Text>
            <Flex flexWrap={"wrap"}>
              {nftMetadata.attributes?.map((v) => (
                <Box border="2px solid olive" p={1} key={v.trait_type}>
                  <Text borderBottom="2px solid olive">{v.trait_type}</Text>
                  <Text>{v.value}</Text>
                </Box>
              ))}
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MintModal;
