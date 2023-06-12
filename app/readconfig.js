function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

const encodedValue = getCookie("config");
const decodedValue = atob(encodedValue);

const config = JSON.parse(decodedValue);