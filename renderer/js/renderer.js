const messageContainer = document.querySelector('#message-block');
const formMsg = document.getElementById("form-msg");

if (formMsg) {
	formMsg.onsubmit = async function (e) {
		e.preventDefault();
		const formData = new FormData(formMsg);

		// get the message value and tool type
		let toolType = formData.get("tools-type");
		let sentValue = formData.get('sent_message');

		// alerts if the message length is <= 8
		if (sentValue.length <= 8) {
			alertMessage("error", "Please input text at least 8 characters or upload image to extract text!");
			return;
		}

		// create sender label
		const senderLabel = document.createElement('div');
		senderLabel.classList.add('name-sender');
		senderLabel.textContent = "Lavranz";

		// create a new message element
		const sendCapsule = document.createElement('div');
		sendCapsule.classList.add('message-s', 'my-1', 'p-2', 'rounded-start');
		sendCapsule.textContent = sentValue;

		// add the message element to the container
		messageContainer.appendChild(senderLabel);
		messageContainer.appendChild(sendCapsule);
		messageContainer.scrollTop = messageContainer.scrollHeight;

		if(toolType=='Friend Chat'){
			// const response = await window.axios.openAI(sentValue, toolType);
			// getReply = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
			let replyValue = toolType;
				
			const receiver = document.createElement('div');
			receiver.classList.add('name-receiver');
			receiver.textContent = "Friend";

			// create a new message element
			const reply_capsule = document.createElement('div');
			reply_capsule.classList.add('message-i', 'my-1', 'p-2', 'rounded-end');
			reply_capsule.textContent = replyValue;

			
			// add the message element to the container
			messageContainer.appendChild(receiver);
			messageContainer.appendChild(reply_capsule);
			messageContainer.scrollTop = messageContainer.scrollHeight;
			insertSupabase(toolType,sentValue,replyValue);
		}
		else {
			// const response = await window.axios.openAI(sentValue, toolType);
			// getReply = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
			let replyValue = toolType;
				
			const receiver = document.createElement('div');
			receiver.classList.add('name-receiver');
			receiver.textContent = "Friend";

			// create a new message element
			const reply_capsule = document.createElement('div');
			reply_capsule.classList.add('message-i', 'my-1', 'p-2', 'rounded-end');
			reply_capsule.textContent = replyValue;
	
			// add the message element to the container
			messageContainer.appendChild(receiver);
			messageContainer.appendChild(reply_capsule);
			messageContainer.scrollTop = messageContainer.scrollHeight;
			insertSupabase(toolType,sentValue,replyValue);
		}

		// clear the input textfield
		const input = document.getElementById('message-inputSent');
		input.value = '';
	}
}

// insert the message values to the SupaBase
async function insertSupabase(toolType,sentValue,replyValue) {
    const response = await window.axios.supaBase('get');
    let highestPromptId = 0;
    Object.keys(response).forEach(key => {
        const promptId = response[key].prompt_id;
        if (promptId > highestPromptId) {
            highestPromptId = promptId;
        }
    })

    await window.axios.supaBase('post', '', {
        prompt_id: highestPromptId + 1,
		tool_type: toolType,
        msg_sent: sentValue,
        msg_reply: replyValue,
        created_at: new Date().toISOString()
    });
}

// messageInbox.addEventListener('submit', (e) => {
// 		e.preventDefault(); // prevent the default form submission behavior
	
// 		// get the message text
// 		const text = messageInputInbox.value.trim();
	
// 		if (text) {
// 			const nameLabel = document.createElement('div');
// 			nameLabel.classList.add('name-receiver');
// 			nameLabel.textContent = "Fred";
// 			// create a new message element
// 			const messageElement = document.createElement('div');
// 			messageElement.classList.add('message-i', 'my-1', 'p-2', 'rounded-end');
// 			messageElement.textContent = text;
	
// 			// add the message element to the containerP
// 			messageContainer.appendChild(nameLabel);
// 			messageContainer.appendChild(messageElement);
// 			messageContainer.scrollTop = messageContainer.scrollHeight;
	
// 			// reset the message input field
// 			messageInputInbox.value = '';
// 		}
// });

function alertMessage(status, message){
	window.Toastify.showToast({
		text: message,
		duration: 3000,
		stopOnFocus: true,
		style: {
			textAlign: "center",
			background: status == "error" ? "red" : "green",
			color: "white",
			padding: "5px",
			marginTop: "2px",
		},
	});
}


// if (form) {
//     form.onsubmit = async function (e) {
//         e.preventDefault();

//         const formData = new FormData(form);

//         let sentence = formData.get("message");
//         if (sentence.length <= 5){
//             alertMessage("error","Please input at least 5 characters");
//             return;    
//         }
				
//         const response = await window.axios.openAI(formData.get("message"));
//         document.getElementById("reply_message").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
//         for (const [key, value] of formData) {
//             // output.textContent += `${key}: ${value}\n`;
//         }
//     };
// }