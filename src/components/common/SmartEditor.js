import React from 'react';

class SmartEditor extends React.Component{

    componentDidMount(){
        // console.log("SmartEditor componentDidMount")
        var oEditors = this.props.oEditors;
        var contentsHtml = this.props.contentsHtml;
        var ediotrID = this.props.editorID;

        if(ediotrID === "ir1"){
            // var oEditors = [];
            var sLang = "ko_KR";	// 언어 (ko_KR/ en_US/ ja_JP/ zh_CN/ zh_TW), default = ko_KR
            // 추가 글꼴 목록
            //var aAdditionalFontSet = [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]];
            window.nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: ediotrID,
                sSkinURI: "/lib/smarteditor/SmartEditor2Skin.html",	
                htParams : {
                    bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                    bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
                    //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
                    fOnBeforeUnload : function(){
                        alert("완료!");
                    },
                    I18N_LOCALE : sLang
                }, //boolean
                fOnAppLoad : function(){
                    //예제 코드
                    //oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
                    oEditors.getById[ediotrID].exec("PASTE_HTML", [contentsHtml]);
                },
                fCreator: "createSEditor2"
            });
        }
    }

    componentDidUpdate(preProps, preState){
        if(preProps.contentsHtml !== this.props.contentsHtml){
            // console.log("SmartEditor componentDidUpdate")
            var oEditors = this.props.oEditors;
            var contentsHtml = this.props.contentsHtml;
            var ediotrID = this.props.editorID;
            // var oEditors = [];
            if(ediotrID === "ir2"){
                var sLang = "ko_KR";	// 언어 (ko_KR/ en_US/ ja_JP/ zh_CN/ zh_TW), default = ko_KR
                // 추가 글꼴 목록
                //var aAdditionalFontSet = [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]];
                window.nhn.husky.EZCreator.createInIFrame({
                    oAppRef: oEditors,
                    elPlaceHolder: ediotrID,
                    sSkinURI: "/lib/smarteditor/SmartEditor2Skin.html",	
                    htParams : {
                        bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                        bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                        bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                        bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
                        //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
                        fOnBeforeUnload : function(){
                            alert("완료!");
                        },
                        I18N_LOCALE : sLang
                    }, //boolean
                    fOnAppLoad : function(){
                        //예제 코드
                        //oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
                        oEditors.getById[ediotrID].exec("PASTE_HTML", [contentsHtml]);
                    },
                    fCreator: "createSEditor2"
                });
            }
        }
    }

    render(){
        const { editorID } = this.props;
        return(
            <div className="form-group edit_wrap" style={{marginBottom:"20px"}}>
                <textarea name={editorID} id={editorID} rows="10" cols="100" style={{width:"100%", height:"500px", display:"none"}}></textarea>                  
            </div>
        )
    }
}

export default SmartEditor;