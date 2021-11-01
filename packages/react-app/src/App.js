import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom'

import { Body, Image } from "./components";
import { ProviederContext } from './features/context/provider'
import logo from "./ethereumLogo.png";

import Head from "./components/Header/Head";
import Container from "./components/Container/Container";
import useWeb3Modal from "./hooks/useWeb3Modal";
import textInDifferntLanguages from "./utils/languages";
import { useSelector } from "react-redux";
function App() {

	const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

    const isConnected = useSelector(state => state.accountReducer.isConnected)
    const language = useSelector(state => state.languageReducer.language)

	return (
		<Router>
			<ProviederContext.Provider value={[provider, loadWeb3Modal, logoutOfWeb3Modal]}>
				<Head>
					{/* <Head provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Moda={logoutOfWeb3Modal}> */}
				</Head>
				<div className="layout">
					<Body>
						<Image src={logo} alt="react-logo" />
						<h1>Lottery</h1>

						{isConnected 
						? <Container />
						: <h2>{textInDifferntLanguages().connectWallet[language]}</h2>}
						
						{/* <Container provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Moda={logoutOfWeb3Modal} /> */}
					</Body>
				</div>
			</ProviederContext.Provider>
		</Router>
	);
}

export default App;
