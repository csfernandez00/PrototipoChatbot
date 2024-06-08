import { Avatar, Segmented, Tooltip } from "antd";
import React from "react";

function SelectUser({ users, setSelectedUser }) {
	const handleChange = (v) => {
		const userFound = users?.filter((u) => u.id === v)[0];
		console.log(userFound);
		setSelectedUser(userFound);
	};

	return (
		<div style={{ marginBottom: "1rem" }}>
			<Segmented
				block={true}
				onChange={handleChange}
				options={users.map((u) => {
					return {
						label: (
							<Tooltip
								style={{ textTransform: "capitalize" }}
								title={u.transactions.map(
									(t, index) =>
										`${t}${index === u.transactions.length - 1 ? "" : " - "}  `
								)}
							>
								<div
									style={{
										padding: 4,
									}}
								>
									<Avatar
										src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
											u.id === "user1" ? 32 : "Oreo"
										}`}
									/>
									<div>{u.name}</div>
								</div>
							</Tooltip>
						),
						value: u.id,
					};
				})}
			/>
		</div>
	);
}

export default SelectUser;
