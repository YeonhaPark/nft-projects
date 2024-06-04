import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import SaleNft from "./pages/SaleNft";
import MintNft from "./pages/MintNft";
import MyNft from "./pages/MyNft";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/my-nft" element={<MyNft />}></Route>
          <Route path="/mint-nft" element={<MintNft />}></Route>
          <Route path="/sale-nft" element={<SaleNft />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
