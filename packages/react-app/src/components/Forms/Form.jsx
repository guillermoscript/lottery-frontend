import styles from './Form.module.css'
import Button from "../Buttons/Button"


export default function Form({children, id, className,}) {
    return (
        <form 
            id={id}
            className={className}>
            {children}
        </form>
    )
}