/*eslint-disable react/prop-types*/ 
import AlertComponent from "./AlertComponent";

let ServerResponse = ({ response }) => {
    let code = response?.code;

    let message = code === "ERR" ? Object.values(response.message)[0] : code === "OK" ? response.message : null;
    let type = code === "ERR" ? "danger" : code === "OK" ? "success" : null;

    switch (code) {
        case "ERR":
            if (message != null) {
                <AlertComponent message={message} type={type} />
            }
            break;
        case "OK":
            return <AlertComponent message={message} type={type} link="/" />

        default:
            return null;
    }

}

export default ServerResponse;


