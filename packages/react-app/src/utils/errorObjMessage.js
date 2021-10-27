const errorMessage = {
    submitTicket: {
        empty: 'Error: Ticket is empty',
        moreThanValid: 'Error: Ticket is longer than permited'
    }
}

export default function retunrErrorMessage() {
    return errorMessage
}