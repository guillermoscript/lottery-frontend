import { useEffect, useState } from "react";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { useSelector, useDispatch } from 'react-redux'
import { Button } from "../index";
import { addAccounts } from '../../features/login/wallet'
import { ethers } from "ethers";
export default function WalletButton({provider,loadWeb3Modal}) {

    // const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
    const [account, setAccount] = useState("");
    const [rendered, setRendered] = useState("");
    const emitEvent = useDispatch()

    useEffect(() => {
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
                    setRendered(name);
                    emitEvent(addAccounts({
                        isConnected: true,
                        account: name,
                        networkName: provider._network.name,
                        accountBalanceEth: inDecimals
                    }))
                } else {
                    setRendered(account.substring(0, 6) + "..." + account.substring(36));
                    emitEvent(addAccounts({
                        isConnected: true,
                        account: account.substring(0, 6) + "..." + account.substring(36),
                        networkName: provider._network.name,
                        accountBalanceEth: inDecimals
                    }))
                }
            } catch (err) {
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
            onClick={() => {
                if (!provider) {
                    loadWeb3Modal();
                }
            }}
        >
            {rendered === "" && "Connect Wallet"}
            {rendered !== "" && rendered}
            {console.log(provider)}
          
        </Button>
    );
}