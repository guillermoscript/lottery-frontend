
import Button from "../Buttons/Button"

export default function Modal({ children,headingWrapper, modalOverlay , modalContent,modalCloseWrapper , closingAction, closingClasssName,modalWrapper , heading }) {
    return (
        <div className={modalWrapper}>
            <div className={modalContent}>
                <div className={modalCloseWrapper}>
                    <Button className={closingClasssName} onClickCallback={closingAction}>
                        X
                    </Button>
                    <div className={headingWrapper}>
                        {heading}
                    </div>
                </div>
                {children}
            </div>
            <div className={modalOverlay} onClick={closingAction}>
            </div>
        </div>
    )
}