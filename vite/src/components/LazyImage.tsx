// LazyImage.js
import { Image } from "@chakra-ui/react";
import { FC } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
}

const LazyImage: FC<LazyImageProps> = ({ src, alt }) => {
  return <Image src={src} alt={alt} alignSelf={"center"} w={60} h={60} />;
};

export default LazyImage;
