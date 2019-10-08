import React from 'react';

const ChoiceItem = ({list}) => {
    return(
        <div className="alist">
            {
                list.map(data => {
                    return (
                        <div className="radios">
                            <input type="radio" id={`ex_radio_${data.nOption}`} name={`step_${data.nStepID}`} value={data.nOption} />
                            <label htmlFor={`ex_radio_${data.nOption}`}>{data.sOption}</label>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ChoiceItem;