import 'core-js/es6/map';  // es6지원 안되는 브라우저 처리..
import 'core-js/es6/set';  
import 'raf/polyfill';     // ie9 호환..
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Promise from 'promise-polyfill';
import 'polyfill-array-includes';
import { Provider } from 'mobx-react';
import RootStore from './stores';

if (!window.Promise) {
    window.Promise = Promise;
}

// ie11 startWith polyfill.
// if (!String.prototype.startsWith) {
// 	String.prototype.startsWith = function(search, pos) {
// 		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
// 	};
// }

// ie11 assign 에러 처리.
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            if (target === undefined || target === null) {
            throw new TypeError('Cannot convert first argument to object');
            }
    
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);
        
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

const stores = new RootStore();
ReactDOM.render(
    <Provider {...stores} >
    <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
