// import { Button } from "../index";
import Button from "../Buttons/Button"
import styles from "./container.module.css"
import btnStyle from "../Buttons/Button.module.css"
import inpStyle from "../Inputs/Input.module.css"
import { useContext, useEffect, useMemo, useState } from "react"

import Modal from "../Modals/Modal";
import modalStyles from '../Modals/Modal.module.css'

import { addresses, abis } from "@project/contracts";
import ContainerModal from "./ContainerModal"
import { Contract } from "@ethersproject/contracts";
import lablStyle from "../Label/Label.module.css"
import { useDispatch, useSelector } from "react-redux"
import useWeb3Modal from "../../hooks/useWeb3Modal"
import { approveSpendingOfToken, checkAllowanceOfToken, getBalanceOfGuilleCoin, getEntryFee, getLotteryState, getWinningNumber } from "../../utils/function"
import { addBalanceOfToken } from "../../features/token/token"
import { addEntryFee } from "../../features/lottery/lottery"
import { ProviederContext } from "../../features/context/provider"
import Input from "../Inputs/Input"
import Form from "../Forms/Form"
import textInDifferntLanguages from "../../utils/languages"
import OwnerContainer from "./OwnerContainer"
import Label from "../Label/Label"
import InputLabelPair from "../Forms/InputLabelPair"

export default function Container() {

    // state variables
    // const [provider] = useWeb3Modal();
    const [provider] = useContext(ProviederContext)
    const [viewSubmitTicket, setViewSubmitTicket] = useState(false);
    const [viewBalanceOf, setViewBalanceOf] = useState(false);
    const [owner, setOwner] = useState(null);
    const [balanceOf, setBalanceOf] = useState('');
    const [viewOfWinner, setViewOfWinner] = useState(false);
    const [viewModalToSelectWinner, setViewModalToSelectWinner] = useState(false);
    const [winningNumber, setWinningNumber] = useState(false);
    const [chooseWinner, setChooseWinner] = useState('');
    const [viewOfRollback, setViewOfRollback] = useState(false)
    const [selectedWinningNumber, setSelectedWinningNumber] = useState(false)
    const [entryFee, setEntryFee] = useState('')
    const [ownerFee, setOwnerFee] = useState('')
    const [newTokenAddress, setNewTokenAddress] = useState('')
    const [errorMessage, setErrorMessage] = useState('')


    // redux variable 
    const isConnected = useSelector(state => state.accountReducer.isConnected)
    const account = useSelector(state => state.accountReducer.account)
    const language = useSelector(state => state.languageReducer.language)
    const userBalanceOfToken = useSelector(state => state.tokenReducer.balanceOf)
    const emitEvent = useDispatch()

    // contracts
    const guilleCoin = useMemo(() => new Contract(addresses.guilleCoin, abis.guilleCoin, provider), [provider])
    const lottery = useMemo(() => new Contract(addresses.lottery, abis.lottery, provider), [provider])

    // helper
    const text = textInDifferntLanguages()

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
        // let lotteryState = await Number(getLotteryState(lottery))
        let lotteryState = await (getLotteryState(lottery))
        console.log(typeof lotteryState);
        console.log(lotteryState);
        console.log(lotteryState);
        if (lotteryState === '2') {
            const stateOfLottery = await lotterySigner._changeState(0)
            console.log('espera a la proxima');
            console.log(await getLotteryState(lottery));
        } else if (lotteryState === '1') {
            console.log(lotteryState);
            const stateOfLottery = await lotterySigner._changeState(2)
            console.log(stateOfLottery);
        } else if (lotteryState === '0') {
            console.log(lotteryState);
            const stateOfLottery = await lotterySigner._changeState(1)
            console.log(stateOfLottery);
        }
    }

    function setStateOfViewToTrue(state) {
        return () => state(true)
    }

    function generalHandleModalClik(state, callback) {
        return () => (state(true), callback())
    }

    async function handleClickOfBalance() {
        const balance = await getBalanceOfGuilleCoin(guilleCoin, account)
        setBalanceOf(balance)
        emitEvent(addBalanceOfToken({ balanceOf: balance }))
    }

    async function hanldeViewOfWinnignNumber() {
        setViewOfWinner(true)
        const number = await getWinningNumber(lottery)
        setWinningNumber(number)
        console.log(winningNumber);
    }

    function handleChange(e) {
        let inputValue = e.target.value;
        if (/^[0-9]*$/ig.test(inputValue) && (inputValue.length > 0 && inputValue.length < 5) || inputValue === '') {
            setChooseWinner(inputValue)
        }
    }

    async function selectWinnerNumber() {
        const signer = provider.getSigner()
        const lotterySigner = lottery.connect(signer)
        // same as above only owner can change
        const winningNumber = await lotterySigner.selectWinner(chooseWinner)
        console.log(winningNumber);
    }

    async function roolOver() {
        const signer = provider.getSigner()
        const lotterySigner = lottery.connect(signer)
        // same as above only owner can change
        const newLottery = await lotterySigner.roolOver(entryFee, ownerFee, newTokenAddress)
        console.log(newLottery);
    }

    function generalHandleChange(e, regex, state) {
        let inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === '') {
            state(inputValue)
        }
    }

    function handleEntryFeeChange(e) {
        generalHandleChange(e, /^[0-9]*$/ig, setEntryFee)
    }
    function handleOwnerFeeChange(e) {
        generalHandleChange(e, /^[0-9]*$/ig, setOwnerFee)
    }
    function handleNewTokenAddressChange(e) {
        generalHandleChange(e, /[a-fA-F0-9]/, setNewTokenAddress)
    }

    const modal = {
        modalContent: modalStyles.modalContent,
        modalWrapper: modalStyles.modalWrapper,
        modalCloseWrapper: modalStyles.modalCloseWrapper,
        modalOverlay: modalStyles.modalOverlay,
        headingWrapper: modalStyles.headingWrapper,
        closingClasssName: `${btnStyle.outBtn} ${btnStyle.btn}`,
        // closingAction: () => setViewBalanceOf(false),
        heading: <h2 className="heading2">{text.yourBalance[language]}</h2>,
    }

    function returnModalComponent(state, headingText, children) {
        return <Modal
            modalContent={modal.modalContent}
            modalWrapper={modal.modalWrapper}
            modalCloseWrapper={modal.modalCloseWrapper}
            modalOverlay={modal.modalOverlay}
            headingWrapper={modal.headingWrapper}
            closingClasssName={modal.closingClasssName}
            closingAction={() => state(false)}
            heading={<h2 className="heading2">{headingText}</h2>}
        >
            {children}
        </Modal>
    }

    return (

        <div className={`${styles.container} ${styles.containerGrid} `}>


            <Button id="btn1"
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}
                onClickCallback={generalHandleModalClik(setViewBalanceOf, handleClickOfBalance)}
            >
                {text.viewBalance[language]}
            </Button>

            <Button id="btn2"
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}
                onClickCallback={handleTicketBuy}
            >
                {text.submitTicket[language]}
            </Button>

            <Button id="btn3"
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}
                onClickCallback={hanldeViewOfWinnignNumber}
            >
                {text.viewWinner[language]}
            </Button>

            {account === owner &&
                <OwnerContainer
                    viewModalToChooseWinner={setStateOfViewToTrue(setViewModalToSelectWinner)}
                    btnStyle={btnStyle}
                    text={text}
                    viewModalToRollback={setStateOfViewToTrue(setViewOfRollback)}
                    language={language}
                    changeStateOfLottery={changeStateOfLottery}
                ></OwnerContainer>
            }

            {/* here is were you can see your balanceOf Token  */}
            {viewBalanceOf && isConnected
                ? returnModalComponent(
                    setViewBalanceOf,
                    text.yourBalance[language],
                    <div className="mrY10">
                        <h3 className="heading2">
                            {balanceOf ? balanceOf : "0.00"} GUILL
                        </h3>
                    </div>
                )
                : false}

            {/* here is were the user can subit a new ticket  */}
            {viewSubmitTicket && isConnected
                ? returnModalComponent(
                    setViewSubmitTicket,
                    text.chooseNumberToParticipate[language],
                    <ContainerModal lottery={lottery} provider={provider}
                        guilleCoin={guilleCoin} contStyle={styles}
                        inpStyle={inpStyle} lablStyle={lablStyle} />
                )
                : false}

            {/* here es were the user can see the winning number  */}
            {viewOfWinner &&
                returnModalComponent(
                    setViewOfWinner,
                    text.viewWinner[language],
                    <p className="txtCenter"> {winningNumber} </p>
                )
            }

            {viewModalToSelectWinner &&
                returnModalComponent(
                    setViewModalToSelectWinner,
                    "Select Winner",
                    <Form className={"flx flxSpcBtw pd2em"}>
                        <div className="flx flxCol flxCenter">

                            <Label className="mrY10" htmlFor="ChooseWinner">ChooseWinner</Label>
                            <Input onChangeCallback={handleChange}
                                value={chooseWinner}
                                id="ChooseWinner"
                                className={`${inpStyle.inpWrite} ${inpStyle.inp}`}
                                type="text"
                            />
                        </div>
                        <Input onClickCallback={selectWinnerNumber}
                            value={text.chooseWinner[language]}
                            className={`${inpStyle.submitBtn} ${inpStyle.darkBtn} ${inpStyle.inp}`}
                            type="submit"
                        />
                    </Form>
                )
            }

            {viewOfRollback &&
                returnModalComponent(
                    setViewOfRollback,
                    text.beginningLottery[language],
                    <Form className={"flx flxCol pd2em"}>

                        <InputLabelPair
                            handleChange={handleEntryFeeChange}
                            inpStyle={inpStyle}
                            value={entryFee}
                            id="entryFee"
                            className={`${inpStyle.inpWrite} ${inpStyle.inp}`}
                            type="text"
                            labelText={"Choose an Entry Fee"}
                        ></InputLabelPair>

                        <InputLabelPair
                            handleChange={handleOwnerFeeChange}
                            inpStyle={inpStyle}
                            value={ownerFee}
                            id="ownerFee"
                            className={`${inpStyle.inpWrite} ${inpStyle.inp}`}
                            type="text"
                            labelText={"Choose an Owner Fee"}
                        ></InputLabelPair>

                        <InputLabelPair
                            handleChange={handleNewTokenAddressChange}
                            inpStyle={inpStyle}
                            value={newTokenAddress}
                            className={`${inpStyle.inpWrite} ${inpStyle.inp}`}
                            id="addresss"
                            type="text"
                            labelText={"Choose an Token Address"}
                        ></InputLabelPair>


                        <div className="flx mrY10 flxSpcBtw fullW">
                            <p className="">{errorMessage}</p>
                        </div>

                        <Input onClickCallback={() => {
                            // roolOver()    
                            console.log('XDDD');
                        }}
                            value={text.chooseWinner[language]}
                            className={`${inpStyle.submitBtn} mrY10 ${inpStyle.darkBtn} ${inpStyle.inp}`}
                            type="submit"
                        />
                    </Form>
                )
            }
        </div>
    )
}