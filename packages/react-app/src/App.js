import React from "react";
import { BrowserRouter as Router } from 'react-router-dom'

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";

import Head from "./components/Header/Head";
import Container from "./components/Container/Container";
function App() {

	return (
		<Router>
			<div className="layout">
				<Head>
					{/* <Head provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Moda={logoutOfWeb3Modal}> */}
				</Head>
				<Body>
					<Image src={logo} alt="react-logo" />
					<Container />
					{/* <Container provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Moda={logoutOfWeb3Modal} /> */}
				</Body>
			</div>
		</Router>
	);
}

export default App;
