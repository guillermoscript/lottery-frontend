import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { Button } from "../index";
import { addAccounts } from '../../features/login/wallet'
import { ethers } from "ethers";


import btnStyle from "./Button.module.css"
// wallet Button for the user to connect to eth
export default function WalletButton({ provider, loadWeb3Modal }) {

    // const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
    const [account, setAccount] = useState("");
    const [rendered, setRendered] = useState("");
    const emitEvent = useDispatch()

    useEffect(() => {
        // moved this from app to this component because is here were the connect logic should be
        async function fetchAccount() {
            try {
                if (!provider) {
                    return;
                }
                // Load the user's accounts.
                const accounts = await provider.listAccounts();
                setAccount(accounts[0]);

                // Resolve the ENS name for the first account.
                const name = await provider.lookupAddress(accounts[0]);
                const amountInHex = await provider.getBalance(accounts[0]);
                const inDecimals = ethers.utils.formatEther(amountInHex)

                // Render either the ENS name or the shortened account address.
                if (name) {

                    // emit event with the data of account to the store
                    setRendered(name);
                    emitEvent(addAccounts({
                        isConnected: true,
                        account: name,
                        networkName: provider._network.name,
                        accountBalanceEth: inDecimals
                    }))
                } else {
                    // emit event with the data of account to the store
                    setRendered(account.substring(0, 6) + "..." + account.substring(36));
                    emitEvent(addAccounts({
                        isConnected: true,
                        account: account,
                        networkName: provider._network.name,
                        accountBalanceEth: inDecimals
                    }))
                }
            } catch (err) {

                // emit event with the data of account to the store
                setAccount("");
                setRendered("");
                console.error(err);
                emitEvent(addAccounts({
                    isConnected: false,
                    account: '',
                    networkName: '',
                    accountBalanceEth: ''
                }))
            }
        }
        fetchAccount();
    }, [account, provider, setAccount, setRendered]);

    return (

        <Button
            className={`${btnStyle.walletButton} ${btnStyle.borderLime}`}
            onClick={() => {
                // if no provider then load to connect
                if (!provider) {
                    loadWeb3Modal();
                }
            }}
        >
            {rendered === "" ? "Connect Wallet" : rendered}
            {console.log(provider)}

            <div className="line"></div>
        </Button>

    );
}