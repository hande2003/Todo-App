/* eslint-disable react/prop-types */

let ValidationErrors = ({ response }) => {
    if (response?.code !== "VE") {
        return null;
    }

    const errorItems = response.message.map((error, index) => (
        <li className="form-text text-danger text-start" key={index}>
            {error}
        </li>
    ));

    return <ul>{errorItems}</ul>;
}

export default ValidationErrors;