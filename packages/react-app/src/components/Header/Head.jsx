import { useSelector } from "react-redux";
import { Header } from "../../components";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import Button from "../Buttons/Button";
import WalletButton from '../Buttons/WalletButton'
import Network from '../Header/Network';
import WalletBalance from "./WalletBalance";
import styles from './header.module.css'


export default function Head({children}) {
    let isConnected = useSelector(state => state.accountReducer.isConnected)
    let networkName = useSelector(state => state.accountReducer.networkName)
    const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

    return (
        <Header>
            {children}
            { isConnected ? 
            <div className={styles.headerWrapper}>
                <div className={styles}>
                    <Network network={networkName} />
                    <WalletBalance />
                </div>
                <div className={styles.headerLogin}>
                    <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal}/>
                    <Button id="disconect" theme="dark" onClickCallback={() => logoutOfWeb3Modal()}>Disconect</Button>
                </div>
            </div>
            :    
            <div className={styles.headerWrapper}>
                <h3>No Network</h3>
                <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal}/>
            </div>
            }
        </Header>
    )
}