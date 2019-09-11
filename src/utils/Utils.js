export default class Utils {
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
        if(localStorage.getItem("login_token") == null || localStorage.getItem("login_token") == "null" || localStorage.getItem("login_token") == "") {
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
}