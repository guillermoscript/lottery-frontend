
export default function Input({type, id, className, onChangeCallback, onClickCallback, value,onSubmitCallback}) {
    return (
        <input 
            type={type} 
            value={value}
            id={id}
            className={className}
            onChange={onChangeCallback}
            onSubmit={onSubmitCallback}
            onClick={onClickCallback} />
    )
}