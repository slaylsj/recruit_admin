const properties = {
    // FILE_DOMAIN : 'http://localhost:8080'
    FILE_DOMAIN : 'https://banapresso.com'
} 

export default class Utils {

    static getDomain = () => {
        return properties.FILE_DOMAIN;
    }
    
    static converDateFormat = (str) => {
        var timestamp = Date.parse(str);
        if (isNaN(timestamp) === true) return str;

        const strDate = new Date(str);
        const localDate = new Date(strDate.getTime() + strDate.getTimezoneOffset()*60*1000);
        
        const year = localDate.getFullYear();
        const month = (localDate.getMonth()+1) < 10 ? "0" + (localDate.getMonth()+1) : "" + (localDate.getMonth()+1);
        const date = localDate.getDate() < 10 ? "0" + localDate.getDate() : "" + localDate.getDate();
        return year + "." + month + "." + date;
    };

    static addClass = ( e, c ) => {
        var cn = e.className;
        if( cn.indexOf( c ) !== -1 ) return;
        if( cn !== '' ) c = ' '+c;
        e.className = cn+c;
    }

    static removeClass = (e, c) => {
        e.className = e.className.replace(new RegExp('(?:^|s)' + c + '(?!S)'), '');
    }

    static hasClass = (e, c) => {
        return (' ' + e.className + ' ').indexOf(' ' + c + ' ') > -1;
    }

    static setToken = (sToken) => {
        localStorage.setItem("login_token",sToken);
    }
     
    static getToken = () => {
        return localStorage.getItem("login_token");
    }
     
    static removeToken = () => {
        localStorage.removeItem("login_token");
        localStorage.removeItem("userID");
        localStorage.removeItem("userNm");
    }
    static chkToken = () => {
        if(localStorage.getItem("login_token") === null || localStorage.getItem("login_token") === "null" || localStorage.getItem("login_token") === "") {
            return false;	    			
        } else {
            return true;
        } 
    }

    static getQueryVariable = (variable) => {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };

    // 파일명 변환
    static createFileNm = (pre_name, exp) => {
        function s4() {
            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        }
        var resultStr = pre_name + s4() + s4() + s4() + "." + exp;
        return resultStr;
    }

    // Editor 내용 파일로 저장.
    static saveFileContentHtml = (blob ,fileName) => {
        const sUploadURL= '/upload010';
        const filePath = "recruit/banaple/html/";
        const content_url = "from_open_storage?ws=fprocess&file=" + filePath + fileName;

        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', sUploadURL);
                let file_upload_form = new FormData();
                file_upload_form.append("ws", "fprocess");
                file_upload_form.append("usage", "banapresso");
                file_upload_form.append("options", "");
                file_upload_form.append("saveFolder", filePath);
                file_upload_form.append("bOverWrite", 1);
                file_upload_form.append("upload_file", blob ,fileName);
                
                xhr.send(file_upload_form);
                xhr.addEventListener('load', () => {
                    console.log("load", xhr.responseText, ' - ', content_url);
                    resolve(content_url);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    // Contetn 파일 내용 조회.
    static readFileContentHtml = (contentUrl) => {
        let contents = null;
        const contentsFilePath = properties.FILE_DOMAIN + "/" + contentUrl;
        try{
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", contentsFilePath, false);
            xmlhttp.send();
            if (xmlhttp.status===200) {
                contents = xmlhttp.responseText;
            }else{
                contents = "[REQUEST_FILE_ERROR] 데이터 조회 시 문제가 발생하였습니다."
            }
        }catch(e){
            contents = "";
        }
        return contents;
    }
}