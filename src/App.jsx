import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
	MainContainer,
	ChatContainer,
	MessageList,
	Message,
	MessageInput,
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const promotions = [
	{ category: "sushi", promo: "20% de descuento en restaurantes de sushi" },
	{ category: "ropa", promo: "15% de descuento en tiendas de ropa" },
	{
		category: "tecnologia",
		promo: "10% de descuento en productos electrónicos",
	},
	{ category: "supermercado", promo: "5% de descuento en supermercados" },
	{ category: "cine", promo: "2x1 en entradas de cine" },
	{ category: "libros", promo: "10% de descuento en librerías" },
	{ category: "viajes", promo: "15% de descuento en paquetes turísticos" },
];

const users = {
	user1: {
		name: "Juan",
		transactions: ["sushi", "ropa", "cine"],
	},
	user2: {
		name: "María",
		transactions: ["tecnologia", "ropa", "supermercado"],
	},
	user3: {
		name: "Carlos",
		transactions: ["libros", "viajes", "sushi"],
	},
	user4: {
		name: "Ana",
		transactions: ["ropa", "supermercado", "cine"],
	},
};

const systemMessage = {
	role: "system",
	content: `
        Eres un asistente virtual para un banco. Ofrece respuestas personalizadas a los clientes basándote en sus transacciones recientes.
        Aquí están las promociones actuales del banco:
        ${promotions.map((p) => `- ${p.promo}`).join("\n")}
        Cuando un usuario haga una consulta, si detectas que han realizado muchas compras en una categoría específica, recomienda la promoción correspondiente.
        Responde de manera amigable y profesional.
    `,
};

function App() {
	const [messages, setMessages] = useState([
		{
			message: "Hola, en que puedo ayudarte?",
			sentTime: "just now",
			sender: "ChatGPT",
		},
	]);
	const [isTyping, setIsTyping] = useState(false);

	const handleSend = async (message) => {
		const newMessage = {
			message,
			direction: "outgoing",
			sender: "user",
		};

		const newMessages = [...messages, newMessage];

		setMessages(newMessages);

		setIsTyping(true);
		await processMessageToChatGPT(newMessages);
	};

	async function processMessageToChatGPT(chatMessages) {
		const currentUser = users.user1; // Cambiar a users.user2 para probar con otro usuario

		const personalizedSystemMessage = {
			...systemMessage,
			content: `
                ${systemMessage.content}
                El usuario actual es ${
									currentUser.name
								} y ha realizado las siguientes transacciones: ${currentUser.transactions.join(
				", "
			)}.
            `,
		};

		let apiMessages = chatMessages.map((messageObject) => {
			let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
			return { role: role, content: messageObject.message };
		});

		const apiRequestBody = {
			model: "gpt-3.5-turbo",
			messages: [personalizedSystemMessage, ...apiMessages],
		};

		await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(apiRequestBody),
		})
			.then((data) => data.json())
			.then((data) => {
				console.log(data);
				setMessages([
					...chatMessages,
					{
						message: data.choices[0].message.content,
						sender: "ChatGPT",
					},
				]);
				setIsTyping(false);
			});
	}

	return (
		<div className="App">
			<div>
				<MainContainer
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
					}}
				>
					<ChatContainer
						style={{
							width: "600px",
							height: "600px",
						}}
					>
						<MessageList
							scrollBehavior="smooth"
							typingIndicator={
								isTyping ? (
									<TypingIndicator content="Asistente escribiendo" />
								) : null
							}
						>
							{messages.map((message, i) => {
								console.log(message);
								return <Message key={i} model={message} />;
							})}
						</MessageList>
						<MessageInput
							placeholder="Escribir consulta"
							attachButton={false}
							onSend={handleSend}
						/>
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	);
}

export default App;
