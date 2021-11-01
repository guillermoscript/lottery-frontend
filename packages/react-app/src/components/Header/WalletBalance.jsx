import { useSelector } from "react-redux"
import textInDifferntLanguages from "../../utils/languages"

export default function WalletBalance(params) {

    const balanceOfAccount = useSelector(state => state.accountReducer.accountBalanceEth)
    const language = useSelector(state => state.languageReducer.language)
    const text = textInDifferntLanguages()
    return (
        <>
            <p>{text.totalOf[language]}: {balanceOfAccount}</p>
        </>
    )
}