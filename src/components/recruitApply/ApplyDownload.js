import React from 'react';
import { Button, Modal } from 'semantic-ui-react'

const ApplyDownload = (props) => {
    const { open, resumeUrl, portfolioUrl} = props.data;
    const { handleDownModalClose, handleFileDownload} = props;
    return(
        <Modal open={open} onClose={handleDownModalClose} className="apply-download">
            <Modal.Header>첨부파일 다운로드</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <div className="download-layer">
                        { resumeUrl !== ''? <div className="resume active" onClick={()=>handleFileDownload(resumeUrl)}>이력서<br/>다운로드</div>
                         : <div className="resume">이력서<br/>다운로드</div>
                        }
                        { portfolioUrl !== ''? <div className="portfolio active" onClick={()=>handleFileDownload(portfolioUrl)}>포트폴리오<br/>다운로드</div>
                         : <div className="portfolio">포트폴리오<br/>다운로드</div>
                        }
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='grey' onClick={handleDownModalClose}>취소</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ApplyDownload;