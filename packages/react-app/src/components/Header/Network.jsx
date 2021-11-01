import { useSelector } from "react-redux"
import textInDifferntLanguages from "../../utils/languages"

export default function Network({network}) {
    const language = useSelector(state => state.languageReducer.language)
    const text = textInDifferntLanguages()
    return (
        <>
            <h3>{text.connectedNetwork[language]}: <span>{network}</span></h3>
        </>
    )
}