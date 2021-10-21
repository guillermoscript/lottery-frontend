import { useSelector } from "react-redux"

export default function WalletBalance(params) {

    const balanceOfAccount = useSelector(state => state.accountReducer.accountBalanceEth)

    return (
        <div>
            <p>Total of {balanceOfAccount}</p>
        </div>
    )
}