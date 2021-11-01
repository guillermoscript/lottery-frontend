import Button from "../Buttons/Button";

export default function OwnerContainer({ changeStateOfLottery,viewModalToRollback , btnStyle, text, language, viewModalToChooseWinner }) {
    return (
        <>
            <Button id="btn4"
                onClickCallback={changeStateOfLottery}
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}  >
                {text.changState[language]}
            </Button>

            <Button id="btn5"
                onClickCallback={viewModalToChooseWinner}
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}  >
                {text.chooseWinner[language]}
            </Button>

            <Button id="btn6"
                onClickCallback={viewModalToRollback}
                className={`${btnStyle.btnCristal} ${btnStyle.btn}`}  >
                {text.beginningLottery[language]}
            </Button>
        </>
    )
}