import Input from "../Inputs/Input";
import Label from "../Label/Label";

export default function InputLabelPair({handleChange,labelText,value,id,type,children,className}) {
    return (
        <div className="flx mrY10 flxCol">
            <Label className="mrY10" htmlFor="ChooseWinner">{labelText}</Label>
            <Input onChangeCallback={handleChange}
                value={value}
                className={className}
                type={type}
                id={id}
            />
            {children}
        </div>
    )
}