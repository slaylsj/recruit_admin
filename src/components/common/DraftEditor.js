import React from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import editor_color_icon from '../../common/image/icon/edit_color_icon.png';

class DraftEditor extends React.Component {
    constructor(props) {
        super(props);
        const html = this.props.contentsHtml;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState
            };
        }else{
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }
    }
  
    onEditorStateChange = (editorState) => {
        this.props.handleChangeContents(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        this.setState({ editorState });
    };

    uploadImageCallBack = (file) => {
        const domain = "http://www.banapresso.com";
        const filePath = "recruit/banaple/write/";
        const image_url = domain + "/from_open_storage?ws=fprocess&file=" + filePath + file.name;

        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload020');
                let file_upload_form = new FormData();
                file_upload_form.append("ws", "fprocess");
                file_upload_form.append("usage", "banapresso");
                file_upload_form.append("options", "");
                file_upload_form.append("saveFolder", filePath);
                file_upload_form.append("bOverWrite", 1);
                file_upload_form.append("image", file);
                
                xhr.send(file_upload_form);
                xhr.addEventListener('load', () => {
                    // const response = JSON.parse(xhr.responseText);
                    let response = { data: { link: image_url}}
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <div >
                <style>{`
                    .wrapper-class { margin:20px 0px; }
                    .editor-class { padding:0px 10px; border:1px solid #e7e7e7; height:550px; overflow:auto;}
                    .toolbar-fontsize { width:60px; }
                    .toolbar-inline {margin-left:20px; }
                    .toolbar-list {margin-left:20px; }
                    .toolbar-text-align {margin-left:20px; }
                    .toolbar-link {margin-left:20px; }
                    .toolbar-history {margin-left:20px; }

                    .rdw-option-wrapper:hover {
                        box-shadow: 1px 1px 0 #bfbdbd;
                        background: #dbe1e1;
                    }
                    .rdw-option-active, .rdw-option-wrapper:active {
                        box-shadow: inset 1px 1px 0 #7bd3dd;
                        background: #94e3ec;
                    }
                `}
                </style>
                <Editor 
                    editorState={editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    toolbar={{
                        options: ['fontFamily', 'fontSize', 'inline', 'colorPicker', 'remove', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
                        fontFamily: {
                            options: ['굴림', '돋움', '바탕', '궁서', '휴먼매직체', 'Arial', 'Couier New', 'Tahoma', 'Times New Roman', 'Verdana', 'Sans Serif', 'Georgia', 'Impact' ],
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                            title: '글꼴'
                        },
                        fontSize: {
                            // icon: fontSize,
                            options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 96],
                            className: "toolbar-fontsize",
                            component: undefined,
                            dropdownClassName: undefined,
                            title: '글자크기'
                        },
                        inline: {
                            inDropdown: false,
                            className: "toolbar-inline",
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['bold', 'italic', 'underline', 'strikethrough'],
                            bold: { className: undefined, title: '진하게'},
                            italic: { className: undefined, title: '기울임꼴' },
                            underline: {  className: undefined, title: '밑줄' },
                            strikethrough: { className: undefined, title: '취소선' },
                            // monospace: {  className: undefined },
                            // superscript: {className: undefined },
                            // subscript: { className: undefined },
                        },
                        colorPicker: {
                            icon: editor_color_icon,
                            className: undefined,
                            component: undefined,
                            popupClassName: undefined,
                            title: '글자색 배경색',
                            colors: ['rgb(255, 0, 0)', 'rgb(255, 108, 0)', 'rgb(255, 170, 0)','rgb(255, 239, 0)', 'rgb(166, 207, 0)', 
                            'rgb(0, 158, 37)', 'rgb(0, 176, 162)', 'rgb(0, 117, 200)', 'rgb(58, 50, 195)', 'rgb(120, 32, 185)',
                            'rgb(255, 255, 255)', 'rgb(0, 0, 0)', 'rgb(37, 37, 37)', 'rgb(70, 70, 70)', 'rgb(99, 99, 99)', 
                            'rgb(125, 125, 125)', 'rgb(154, 154, 154)', 'rgb(239, 0, 124)', 'rgb(239, 0, 124)','rgb(229, 115, 174)',
                            'rgb(255, 232, 232)', 'rgb(233, 125, 129)', 'rgb(233, 125, 129)', 'rgb(225, 155, 115)', 'rgb(209, 178, 116)', 
                            'rgb(207, 204, 162)', 'rgb(207, 204, 162)', 'rgb(97, 185, 119)', 'rgb(83, 174, 168)', 'rgb(106, 101, 187)']
                        }, 
                        remove: {  className: undefined, component: undefined, title: '서식 지우기' },
                        list: {
                            inDropdown: false,
                            className: "toolbar-list",
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['unordered', 'ordered'],
                            unordered: { className: undefined, title:'글머리기호' },
                            ordered: { className: undefined, title:'번호매기기' },
                            // indent: { className: undefined },
                            // outdent: {  className: undefined },
                            },
                        textAlign: {
                            inDropdown: false,
                            className: "toolbar-text-align",
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['left', 'center', 'right', 'justify'],
                            left: { className: undefined, title:'왼쪽정렬'},
                            center: {  className: undefined, title:'가운데정렬' },
                            right: {  className: undefined, title:'오른쪽정렬' },
                            justify: { className: undefined, title:'양쪽정렬' },
                        },
                        link: {
                            inDropdown: false,
                            className: "toolbar-link",
                            component: undefined,
                            popupClassName: undefined,
                            dropdownClassName: undefined,
                            showOpenOptionOnHover: true,
                            defaultTargetOption: '_self',
                            options: ['link', 'unlink'],
                            link: {  className: undefined, title: '링크' },
                            unlink: {  className: undefined, title: '링크제거' },
                            linkCallback: undefined
                        },
                        emoji: {
                            title: '이모티콘'
                        },
                        image: {
                            // icon: image,
                            className: undefined,
                            component: undefined,
                            popupClassName: undefined,
                            urlEnabled: false,
                            uploadEnabled: true,
                            alignmentEnabled: true,
                            uploadCallback: this.uploadImageCallBack,
                            previewImage: true,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                            alt: { present: false, mandatory: false },
                            defaultSize: {
                                height: 'auto',
                                width: 'auto',
                            },
                            title: '이미지첨부'
                        },
                        history: {
                            inDropdown: false,
                            className: "toolbar-history",
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['undo', 'redo'],
                            undo: {  className: undefined, title: '이전으로 되돌리기' },
                            redo: { className: undefined, title: '다음으로 되돌리기' },
                        }
                    }}
                    mention={{
                        separator: ' ',
                        trigger: '#',
                        suggestions: [
                          { text: 'APPLE', value: 'apple', url: 'apple' },
                          { text: 'BANANA', value: 'banana', url: 'banana' },
                          { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                          { text: 'DURIAN', value: 'durian', url: 'durian' },
                          { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                          { text: 'FIG', value: 'fig', url: 'fig' },
                          { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                          { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
                        ],
                      }}
                />
            {/* <textarea style={{width:"100%", height:"300px", margin:"5px 0px"}}
                disabled
                value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            <textarea style={{width:"100%", height:"300px", margin:"5px 0px"}}
                disabled
                value={editorState.getCurrentContent()}
                />     */}
            </div>
        )
    }
};

export default DraftEditor;