
const DataBox = ( {lbl1, lbl2, lbl3, attr1, attr2, attr3}) => {
    return (
        <div className="data-box">
            {lbl1 ? (
                <div>
                    <p> <strong>{lbl1}</strong>: {attr1} </p>
                </div>
            ): null}
            {lbl2 ? (
                <div>
                    <p> <strong>{lbl2}</strong>: {attr2} </p>
                </div>
            ): null}
            {lbl3 ? (
                <div>
                    <p> <strong>{lbl3}</strong>: {attr3} </p>
                </div>
            ): null}
        </div>
    )
}

export default DataBox