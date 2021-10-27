export default function Button({children,className,onClickCallback, id}) {

    return (
        <button className={className} onClick={onClickCallback} id={id}>
            {children}
        </button>
    )
}