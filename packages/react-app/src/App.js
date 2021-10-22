import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom'

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

import Head from "./components/Header/Head";

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider();
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const ceaErc20 = new Contract(addresses.ceaErc20, abis.erc20, defaultProvider);
  // A pre-defined address that owns some CEAERC20 tokens
  const tokenBalance = await ceaErc20.balanceOf("0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C");
  console.log({ tokenBalance: tokenBalance.toString() });
}


function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);



  return (
    <Router>
      <div>
        <Head>
        </Head>
        <Body>
          <Image src={logo} alt="react-logo" />
          
          {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
          {/* <Button hidden onClick={() => readOnChainData()}>
            Read On-Chain Balance
          </Button>
          <Link href="https://ethereum.org/developers/#getting-started" style={{ marginTop: "8px" }}>
            Learn Ethereum
          </Link>
          <Link href="https://reactjs.org">Learn React</Link>
          <Link href="https://thegraph.com/docs/quick-start">Learn The Graph</Link> */}
        </Body>
      </div>
    </Router>
  );
}

export default App;
