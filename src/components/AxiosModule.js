import axios from "axios";

console.log("axios base url : ", process.env.REACT_APP_GW_URL_LOCAL);
// console.log("axios base url : ", process.env.REACT_APP_GW_URL_COMPANY);
const instance = axios.create({
    baseURL: process.env.REACT_APP_GW_URL_LOCAL,
    // baseURL: process.env.REACT_APP_GW_URL_COMPANY,
    timeout: 1000
});
instance.interceptors.request.use(
    config => {
        /** config에는 위의 axiosInstance 객체를 이용하여 request를 보냈을떄의 모든 설정값들이 들어있다.
         * [활용]
         * 1. api요청의 경우 token이 필요한 경우가 있는데, 필요에 따른 토큰 정보들을 여기서 처리할 경우
         * 토큰에 대한 정보를 여러곳에서 처리하지 않아도 된다.
         * 2. 요청 method에 따른 외부로 드러내지 않고 처리하고 싶은 부분에 대한 작업이 가능
         */
        // config.headers["Access-Control-Allow-Origin"] = "*";
        // config.headers["Access-Control-Allow-Headers"] = "Content-Type";
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    error => {
        /** request 요청을 보낼때 error가 발생하는 경우 여기서 catch가 가능하다. */
        console.log('axios interceptor request error : ', error);
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    config => {
        /** 요청을 보낸 뒤에 response(응답)이 오는 경우에 여기서 먼저 확인이 가능하다.
         * [활용]
         * 1. status-code가 정상적이어도 내용상의 이유로 에러처리가 필요한 경우
         * 2. 민감정보 또는 데이터에 대한 가공 작업
         */
        config.headers["Content-Type"] = "application/json"
        return config;
    },
    ({config, request, response, ...error}) => {
        /** response응답 후에 status-code가 4xx, 5xx 처럼 에러를 나타내는 경우 해당 루트를 수행한다. */
        console.log('axios interceptor response error : ', error);

        const errMsg = 'Error Message';
        return Promise.reject({
            config,
            message: errMsg,
            response, 
            ...error
        });
    }
);

export default instance;