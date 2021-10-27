
export default function Text({ children, typeText, content, id, className }) {
    return (
        <>
            <Text id={id} className={className}>
                {content}
            </Text>
        </>
    )
}