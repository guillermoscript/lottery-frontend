import { useSelector } from "react-redux";
import { Header } from "../../components";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import Button from "../Buttons/Button";
import WalletButton from '../Buttons/WalletButton'
import Network from '../Header/Network';
import WalletBalance from "./WalletBalance";


export default function Head({children}) {
    let isConnected = useSelector(state => state.accountReducer.isConnected)
    let networkName = useSelector(state => state.accountReducer.networkName)
    const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

    return (
        <Header>
            <header>
                {children}
                { isConnected ? 
                <div>
                    <Network network={networkName} />
                    <WalletBalance />
                    <WalletButton />
                    <button onClick={() => logoutOfWeb3Modal()}>Disconect</button>
                </div>
                :    
                <div>
                    <h3>No Network</h3>
                    <WalletButton />
                </div>
                }
            </header>
        </Header>
    )
}