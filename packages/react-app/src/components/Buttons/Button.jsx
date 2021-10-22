export default function Button({children,theme,onClickCallback, id}) {

    let classTheme = `btnTheme${theme}`

    return (
        <button className={classTheme} onClick={onClickCallback} id={id}>
            {children}
        </button>
    )
}