import moment from 'moment';
export default function () {
    // 间隔30秒检测是否长时间不操作页面
    window.setInterval(checkTimeOut, 30000);
}
window.onload = () => {
    window.document.onmousedown = () => {
        const currentTime = + moment().format('X').valueOf();
        window.localStorage.setItem('x_last_time', JSON.stringify(currentTime));
    };
}
const timeOuts =  3600 // 超时时间设置  30分钟
const checkTimeOut = () => {
    const currentTime = + moment().format('X').valueOf();
    const lastTime: number = window.localStorage.getItem('x_last_time') || currentTime;
    if (currentTime - lastTime > timeOuts) {
        window.localStorage.clear();
        window.location.href = 'http://192.168.20.222';
    }
}