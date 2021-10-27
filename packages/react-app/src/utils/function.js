export async function asyncHelper(data) {
    try {
        const info = await data
        return [info, null]
    } catch (error) {
        console.log(error);
        return [null, error]
    }
}

export async function checkAllowanceOfToken(token, account, addresse) {
    const tokenAllowance = await token.allowance(account, addresse);
    console.log(tokenAllowance.toString());
    return tokenAllowance.toString()
}

export async function getBalanceOfGuilleCoin(token, account) {
    // A pre-defined address that owns some CEAERC20 tokens
    const tokenBalance = await token.balanceOf(account);
    console.log(tokenBalance.toString());
    return tokenBalance.toString()
}

export async function getEntryFee(lottery) {
    const entryFee = await lottery.entryFee()
    return entryFee.toString()
}

export async function getLotteryState(lottery) {
    const entryFee = await lottery.state()
    return entryFee.toString()
}

export async function getNumbersEntered(lottery) {
    const entryFee = await lottery.numbersEntered()
    return entryFee.toString()
}

export async function getSizeOfTicket(lottery) {
    const entryFee = await lottery.sizeOfTicket()
    return entryFee.toString()
}

export async function approveSpendingOfToken(provider, token, address) {
    const signer = provider.getSigner()
    const tokenSigner = token.connect(signer)
    const isAprovedSpending = await tokenSigner.approve(address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").catch(er => console.log(er))
    console.log(isAprovedSpending);
}