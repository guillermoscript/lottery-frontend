import { useSelector } from "react-redux";
import { Header } from "../../components";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import Button from "../Buttons/Button";
import WalletButton from '../Buttons/WalletButton'
import Network from '../Header/Network';
import WalletBalance from "./WalletBalance";
import styles from './header.module.css'
import { ProviederContext } from "../../features/context/provider";
import { useContext } from "react";
import btnStyle from "../Buttons/Button.module.css"

// export default function Head({children, provider, loadWeb3Modal, logoutOfWeb3Modal}) {
export default function Head({ children }) {
    const isConnected = useSelector(state => state.accountReducer.isConnected)
    const networkName = useSelector(state => state.accountReducer.networkName)
    const [provider,loadWeb3Modal, logoutOfWeb3Modal] = useContext(ProviederContext)
    // const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

    return (
        <Header>
            {children}
            {isConnected ?
                <div className={styles.headerWrapper}>
                    <div>
                        <Network network={networkName} />
                        <WalletBalance />
                    </div>
                    <div className={styles.headerLogin}>
                        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} />
                        <Button id="disconect" className={`${btnStyle.walletButton} ${btnStyle.borderRed}`} theme="dark"
                            onClickCallback={() => logoutOfWeb3Modal()}>
                            Disconect

                <div className="line2"></div>
                        </Button>
                    </div>
                </div>
                :
                <div className={styles.headerWrapper}>
                    <h3>No Network</h3>
                    <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} />
                </div>
            }
        </Header>
    )
}