/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
function AlertComponent({ type, message, link="#"  }) {
	
	return (
	<div className={`alert alert-${type} alert-dismissible`} role="alert">
			<div>{message}</div>
			<Link to={link} className="btn-close"></Link>
	</div>
  )
}


export default AlertComponent;