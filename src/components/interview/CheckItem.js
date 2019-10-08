import React from 'react';

const CheckItem = ({list}) => {
    return(
        <div className="alist">
            {
                list.map(data => {
                    return (
                        <div className="checks">
                            <input type="checkbox" id={`ex_chk1${data.nOption}`} name={`step_${data.nStepID}`} value={data.nOption}/>
                            <label htmlFor={`ex_chk1${data.nOption}`}>{data.sOption}</label>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CheckItem;