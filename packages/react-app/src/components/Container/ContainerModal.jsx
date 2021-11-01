import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import retunrErrorMessage from "../../utils/errorObjMessage"
import { getTokenName } from "../../utils/function"
import textInDifferntLanguages from "../../utils/languages"
import Form from "../Forms/Form"
import Input from "../Inputs/Input"
import Label from "../Label/Label"
import Tooltip from "../Tooltip/Tooltip"
import TooltipStyle from "../Tooltip/Tooltip.module.css"

export default function ContainerModal({ inpStyle, lablStyle, contStyle, lottery, guilleCoin, provider, }) {

    const [lotteryNumbers, setLotteryNumbers] = useState('');
    const [tokenName, setTokenName] = useState('')
    const [priceOfLotteryNumber, setPriceOfLotteryNumber] = useState(10);
    const [totalOfLotteryNumber, setTotalOfLotteryNumber] = useState(0);
    const [errorMessage, setErrorMessage] = useState('')
    

    // redux
    const tokenEntryFee = useSelector(state => state.lotteryReducer.entryFee)
    const language = useSelector(state => state.languageReducer.language)

    // helpers
    const text = textInDifferntLanguages()


    useEffect(() => {
        getTokenName(guilleCoin).then((name) => setTokenName(name))
    },[])

    function handleChange(e) {
        let inputValue = e.target.value;
        if (/^[,0-9]*$/ig.test(inputValue) || inputValue === '') {
            setLotteryNumbers(inputValue)
            console.log(lotteryNumbers);
            showTotalOfTicketBought()
            calculatePriceOfTicket()
            if (errorMessage.length > 0) {
                setErrorMessage('')
            }
        }
    }

    function showTotalOfTicketBought() {
        let numbers = (lotteryNumbers).split(',').filter(el => el);
        setTotalOfLotteryNumber(numbers.length)
    }

    function calculatePriceOfTicket() {
        let numbers = (lotteryNumbers).split(',').filter(el => el);
        const price = Number(tokenEntryFee);
        setPriceOfLotteryNumber(price * numbers.length)
    }

    function parseError(error) {
        console.log(error.message);
        setErrorMessage(error.message)
        // if (error.error.message === undefined) {
        //     setErrorMessage(error.error)
        // } else {
        //     setErrorMessage(error.error.message)
        // }
    }

    async function handleSubmit(e) {
        // e.preventDefault()
        const errorMessages = retunrErrorMessage()
        let numbers = [...new Set(lotteryNumbers.split(',').filter(el => el))]
        console.log(numbers);
        let isEveryNumberInRange = numbers.every(number => number.length < 5)
        if (numbers.length === 0) {
            setErrorMessage(errorMessages.submitTicket.empty)
            return 
        }
        if (!isEveryNumberInRange) {
            setErrorMessage(errorMessages.submitTicket.moreThanValid)
            return 
        }
        showTotalOfTicketBought()
        calculatePriceOfTicket()
        const signer = provider.getSigner()
        const loterrySigner = lottery.connect(signer)
        const isSubmited = await loterrySigner.submitNumber(numbers).catch(parseError);
        console.log(isSubmited);
    }

    return (
        <div className={contStyle.container}>
            <Form id="formSubmitNumber" className="flxCenterX flx flxWrp">

                <div className="flx flxCol mrY10 fullW">
                    <Label htmlFor="lotteryNumber"
                        className={`${lablStyle.labellLigth} ${lablStyle.labell}`}>
                        {text.lotteryNumber[language]}
                        <Tooltip
                            iconClassName={TooltipStyle.tooltip}
                            toolClassName={TooltipStyle.tooltiptext}>{text.instructionToolTip[language]} </Tooltip> </Label>
                    <Input
                        id="lotteryNumber"
                        className={`${inpStyle.inpWrite} ${inpStyle.inp}`}
                        value={lotteryNumbers}
                        onChangeCallback={handleChange}
                        type="text" />
                </div>

                <div className="flx mrY10 flxSpcBtw fullW">
                    <p className="">{text.ticketPrice[language]}:</p>
                    <p className=""> {tokenEntryFee} {tokenName} </p>
                </div>

                <div className="flx mrY10 flxSpcBtw fullW">
                    <p className="">{text.totalTicket[language]}:</p>
                    <p className=""> {totalOfLotteryNumber} Tickets</p>
                </div>

                <div className="flx mrY10 flxSpcBtw fullW">
                    <p className="">Total:</p>
                    <p className=""> {priceOfLotteryNumber} {tokenName} </p>
                </div>

                <div className="flx mrY10 flxSpcBtw fullW">
                    <p className="">{errorMessage}</p>
                </div>

                <Input
                    id="submitNumber"
                    className={`${inpStyle.submitBtn} ${inpStyle.darkBtn} ${inpStyle.inp}`}
                    value={text.joinLottery[language]}
                    onClickCallback={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    type="submit" />
            </Form>
        </div>
    )
}