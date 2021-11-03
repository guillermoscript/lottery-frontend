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
import { approveSpendingOfToken, checkAllowanceOfToken, contractSigner, getBalanceOfGuilleCoin, getEntryFee, getLotteryState, getWinningNumber } from "../../utils/function"
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

    const viewType = Object.freeze({
        viewSubmitTickets: "viewSubmitTickets",
        viewBalanceOf: "viewBalanceOf",
        viewOfWinner: "viewOfWinner",
        viewModalToChooseWinner: "viewModalToChooseWinner",
        viewOfRollback: "viewOfRollback",
    })
    // state variables
    const [provider] = useContext(ProviederContext)
    const [viewOfModal, setViewOfModal] = useState('')
    const [owner, setOwner] = useState(null);
    const [balanceOf, setBalanceOf] = useState('');
    const [winningNumber, setWinningNumber] = useState(false);
    const [chooseWinner, setChooseWinner] = useState('');
    const [entryFee, setEntryFee] = useState('')
    const [ownerFee, setOwnerFee] = useState('')
    const [newTokenAddress, setNewTokenAddress] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // redux variable 
    const isConnected = useSelector(state => state.accountReducer.isConnected)
    const account = useSelector(state => state.accountReducer.account)
    const language = useSelector(state => state.languageReducer.language)
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
            const lotterySigner = contractSigner(provider, lottery)
            const owner = await lotterySigner.owner()
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
        if (Number(allowance) < Number(entryFee)) {
            approveSpendingOfToken(provider, guilleCoin, addresses.lottery)
        }
        // let the modal show
        setViewOfModal(viewType.viewSubmitTickets)
    }

    async function changeStateOfLottery() {

        // this functions are from utili made of posible cases of states
        const casesOfState = {
            0: lotterySigner => lotterySigner._changeState(1).catch(err => setErrorMessage(err.message)),
            1: lotterySigner => lotterySigner._changeState(2).catch(err => setErrorMessage(err.message)),
            2: lotterySigner => lotterySigner._changeState(0).catch(err => setErrorMessage(err.message)),
        }
        // only the owner can change the state 
        // even if you click this without having the private key the Contract will not allow you, the error handlign is not done of course 
        const lotterySigner = contractSigner(provider, lottery)
        const lotteryState = await getLotteryState(lottery)

        // get the state and depending on the state call the function will change the state acording to the case
        const newState = await casesOfState[lotteryState](lotterySigner)
        console.log(newState);
    }

    function setStateOfViewToTrue(setState, state) {
        return () => setState(state)
    }

    function generalHandleModalClik(setState, state, callback) {
        return () => (setState(state), callback())
    }

    async function handleClickOfBalance() {
        const balance = await getBalanceOfGuilleCoin(guilleCoin, account)
        setBalanceOf(balance)
        emitEvent(addBalanceOfToken({ balanceOf: balance }))
    }

    async function hanldeViewOfWinnignNumber() {
        const number = await getWinningNumber(lottery)
        setWinningNumber(number)
        console.log(winningNumber);
    }

    function handleChange(e) {
        let inputValue = e.target.value;
        if ((/^[0-9]*$/ig.test(inputValue) && (inputValue.length > 0 && inputValue.length < 5)) || inputValue === '') {
            setChooseWinner(inputValue)
        }
    }

    async function selectWinnerNumber() {
        const lotterySigner = contractSigner(provider, lottery)
        // same as above only owner can change
        const winningNumber = await lotterySigner.selectWinner(chooseWinner).catch(err => setErrorMessage(err))
        console.log(winningNumber);
    }

    async function roolOver() {
        const lotterySigner = contractSigner(provider, lottery)
        // same as above only owner can change
        const newLottery = await lotterySigner.roolOver(entryFee, ownerFee, newTokenAddress).catch(err => setErrorMessage(err))
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

    function returnModalComponent(setState, state, headingText, children) {
        return <Modal
            modalContent={modal.modalContent}
            modalWrapper={modal.modalWrapper}
            modalCloseWrapper={modal.modalCloseWrapper}
            modalOverlay={modal.modalOverlay}
            headingWrapper={modal.headingWrapper}
            closingClasssName={modal.closingClasssName}
            closingAction={() => setState(state)}
            heading={<h2 className="heading2">{headingText}</h2>}
        >
            {children}
        </Modal>
    }

    return (
        <div className={`${styles.container} ${styles.containerGrid} `}>

            <Button id="btn1"
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}
                onClickCallback={generalHandleModalClik(setViewOfModal, viewType.viewBalanceOf, handleClickOfBalance)}
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
                onClickCallback={generalHandleModalClik(setViewOfModal, viewType.viewOfWinner, hanldeViewOfWinnignNumber)}
            >
                {text.viewWinner[language]}
            </Button>

            {account === owner &&
                <OwnerContainer
                    viewModalToChooseWinner={setStateOfViewToTrue(setViewOfModal, viewType.viewModalToChooseWinner)}
                    btnStyle={btnStyle}
                    text={text}
                    viewModalToRollback={setStateOfViewToTrue(setViewOfModal, viewType.viewOfRollback)}
                    language={language}
                    changeStateOfLottery={changeStateOfLottery}
                ></OwnerContainer>
            }

            {/* here is were you can see your balanceOf Token  */}

            {viewOfModal === viewType.viewBalanceOf && isConnected
                ? returnModalComponent(
                    setViewOfModal,
                    '',
                    text.yourBalance[language],
                    <div className="mrY10">
                        <h3 className="heading2">
                            {balanceOf ? balanceOf : "0.00"} GUILL
                        </h3>
                    </div>
                )
                : false}

            {/* here is were the user can subit a new ticket  */}
            {viewOfModal === viewType.viewSubmitTickets && isConnected
                ? returnModalComponent(
                    setViewOfModal,
                    '',
                    text.chooseNumberToParticipate[language],
                    <ContainerModal lottery={lottery} provider={provider}
                        guilleCoin={guilleCoin} contStyle={styles}
                        inpStyle={inpStyle} lablStyle={lablStyle} />
                )
                : false}

            {/* here es were the user can see the winning number  */}
            {viewOfModal === viewType.viewOfWinner &&
                returnModalComponent(
                    setViewOfModal,
                    '',
                    text.viewWinner[language],
                    <p className="txtCenter"> {winningNumber} </p>
                )
            }

            {viewOfModal === viewType.viewModalToChooseWinner &&
                returnModalComponent(
                    setViewOfModal,
                    '',
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

            {viewOfModal === viewType.viewOfRollback &&
                returnModalComponent(
                    setViewOfModal,
                    '',
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
                            roolOver()
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