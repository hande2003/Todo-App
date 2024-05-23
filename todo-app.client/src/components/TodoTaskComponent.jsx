//{
//	tasks.length > 0 && (
//		<ul
//			style={{ listStyleType: "none" }}
//			className="p-0"
//			ref={listItems}
//		>
//			{tasks.map((task, index) => {
//				return (
//					<li key={task} id={`task-${index + 1}`} className="mb-3">
//						<div className="input-group">
//							<div className="input-group-text">
//								<input
//									className="form-check-input mt-0"
//									type="checkbox"
//									defaultValue=""
//									aria-label="Checkbox for following text input"
//									onClick={handleTaskToggle}
//									id={`task-checkbox-${index + 1}`}
//								/>
//							</div>

//							<input
//								type="text"
//								className="form-control"
//								aria-label="Text input with checkbox"
//								value={task}
//								readOnly
//							/>
//							<button
//								className="btn btn-outline-secondary"
//								type="button"
//								id="button-addon2"
//								onClick={() => handleRemove(index)}
//							>
//								<i className="bi bi-trash2"></i>
//							</button>
//						</div>
//					</li>
//				);
//			})}
//		</ul>
//	)
//}