// import { Button } from "../index";
import Button from "../Buttons/Button"
import styles from "./container.module.css"
import btnStyle from "../Buttons/Button.module.css"
import inpStyle from "../Inputs/Input.module.css"
import { useEffect, useMemo, useState } from "react"

import Modal from "../Modals/Modal";
import modalStyles from '../Modals/Modal.module.css'

import { addresses, abis } from "@project/contracts";
import ContainerModal from "./ContainerModal"
import { Contract } from "@ethersproject/contracts";
import lablStyle from "../Label/Label.module.css"
import { useDispatch, useSelector } from "react-redux"
import useWeb3Modal from "../../hooks/useWeb3Modal"
import { approveSpendingOfToken, checkAllowanceOfToken, getBalanceOfGuilleCoin, getEntryFee, getLotteryState } from "../../utils/function"
import { addBalanceOfToken } from "../../features/token/token"
import { addEntryFee } from "../../features/lottery/lottery"

export default function Container() {

    // state variables
    const [provider] = useWeb3Modal();
    const [viewSubmitTicket, setViewSubmitTicket] = useState(false);
    const [viewBalanceOf, setViewBalanceOf] = useState(false);
    const [owner, setOwner] = useState('');
    const [balanceOf, setBalanceOf] = useState('');
    const [viewOfWinner, setViewOfWinner] = useState(false);

    // redux variable 
    const isConnected = useSelector(state => state.accountReducer.isConnected)
    const account = useSelector(state => state.accountReducer.account)
    const userBalanceOfToken = useSelector(state => state.tokenReducer.balanceOf)
    const emitEvent = useDispatch()

    // contracts
    const guilleCoin = useMemo(() => new Contract(addresses.guilleCoin, abis.guilleCoin, provider), [provider])
    const lottery = useMemo(() => new Contract(addresses.lottery, abis.lottery, provider), [provider])

    // i use thise useEffect so the button below that its only for owner can show, not so secure but is just a example
    useEffect(() => {
        async function getOwnerOfLottery() {
            if (!provider) return
            // idk if i have to connect every time or just one and export that from file to file
            const signer = provider.getSigner()
            const loterrySigner = lottery.connect(signer)
            const owner = await loterrySigner.owner()
            setOwner(owner)
        }
        getOwnerOfLottery()
    }, [account])

    async function handleTicketBuy() {

        // this functions are from utili made
        const allowance = await checkAllowanceOfToken(guilleCoin, account, addresses.lottery)
        const entryFee = await getEntryFee(lottery)
        // set to store the entry fee
        emitEvent(addEntryFee({ entryFee }))
        // console.log(Number(allowance) < Number(entryFee),entryFee,allowance, 'Xd');
        // aprove spendign of your token 
        if (Number(allowance) < Number(entryFee)) {
            approveSpendingOfToken(provider, guilleCoin, addresses.lottery)
        }
        // let the modal show
        setViewSubmitTicket(true)
    }

    async function changeStateOfLottery() {
        // only the owner can change the state 
        // even if you click this without having the private key the Contract will not allow you, the error handlign is not done of course 
        const signer = provider.getSigner()
        const lotterySigner = lottery.connect(signer)
        const stateOfLottery = await lotterySigner._changeState(1)
        console.log(stateOfLottery);
    }

    async function selectWinner() {
        const signer = provider.getSigner()
        const lotterySigner = lottery.connect(signer)
        // same as above only owner can change
        const winningNumber = await lotterySigner.selectWinner(1)
        console.log(winningNumber);
    }

    return (
        
        <div className={`${styles.container} ${styles.containerGrid} `}>
            <Button id="btn1" className={`${btnStyle.btnLight} ${btnStyle.btn}`} onClickCallback={async () => {
                const balance = await getBalanceOfGuilleCoin(guilleCoin, account)
                setViewBalanceOf(true)
                setBalanceOf(balance)
                emitEvent(addBalanceOfToken({ balanceOf: balance }))
            }} >
                Ver Saldo
            </Button>
            <Button id="btn2" className={`${btnStyle.btnLight} ${btnStyle.btn}`} onClickCallback={() => {
                handleTicketBuy()
            }} >
                Comprar ticket
            </Button>
            <Button id="btn3" className={`${btnStyle.btnLight} ${btnStyle.btn}`}  >
                Ver Ganador
            </Button>

            {account === owner &&
                <>
                    <Button id="btn4" onClickCallback={() => {
                        changeStateOfLottery()
                    }} className={`${btnStyle.btnLight} ${btnStyle.btn}`}  >
                        Cabiar Estado
                    </Button>
                    <Button id="btn5" onClickCallback={async () => {
                        const winner = await selectWinner();
                        console.log(winner);
                    }} className={`${btnStyle.btnLight} ${btnStyle.btn}`}  >
                        Elegir Ganador
                    </Button>
                </>
            }

            {viewOfWinner &&
                <Modal
                    modalContent={modalStyles.modalContent}
                    modalWrapper={modalStyles.modalWrapper}
                    modalCloseWrapper={modalStyles.modalCloseWrapper}
                    modalOverlay={modalStyles.modalOverlay}
                    headingWrapper={modalStyles.headingWrapper}
                    closingClasssName={`${btnStyle.outBtn} ${btnStyle.btn}`}
                    closingAction={() => setViewOfWinner(false)}
                    heading={<h2 className="heading2">El Ganador es </h2>}
                >
                    <p>0x00</p>
                </Modal>
            }


            {viewSubmitTicket && isConnected
                ? <Modal
                    modalContent={modalStyles.modalContent}
                    modalWrapper={modalStyles.modalWrapper}
                    modalCloseWrapper={modalStyles.modalCloseWrapper}
                    modalOverlay={modalStyles.modalOverlay}
                    headingWrapper={modalStyles.headingWrapper}
                    closingClasssName={`${btnStyle.outBtn} ${btnStyle.btn}`}
                    closingAction={() => setViewSubmitTicket(false)}
                    heading={<h2 className="heading2">Elige un numero para participar</h2>}
                >
                    <ContainerModal lottery={lottery} provider={provider}
                        guilleCoin={guilleCoin} contStyle={styles}
                        inpStyle={inpStyle} lablStyle={lablStyle} />
                </Modal>
                : false}
            {viewBalanceOf && isConnected
                ? <Modal
                    modalContent={modalStyles.modalContent}
                    modalWrapper={modalStyles.modalWrapper}
                    modalCloseWrapper={modalStyles.modalCloseWrapper}
                    modalOverlay={modalStyles.modalOverlay}
                    headingWrapper={modalStyles.headingWrapper}
                    closingClasssName={`${btnStyle.outBtn} ${btnStyle.btn}`}
                    closingAction={() => setViewBalanceOf(false)}
                    heading={<h2 className="heading2">Tu Balance de GuilleCoins</h2>}
                >
                    <div className="mrY10">
                        <h3 className="heading2">
                            {balanceOf ? balanceOf : "0.00"} GUILL
                        </h3>
                    </div>
                </Modal>
                : false}


        </div>
    )
}