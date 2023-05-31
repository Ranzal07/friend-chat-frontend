const messageContainer = document.querySelector('#message-block');
const formMsg = document.getElementById("form-msg");
let receiverName = document.getElementById("profile-name");

// processing the submit form
if (formMsg) {
	formMsg.onsubmit = async function (e) {
		e.preventDefault();

		try{
			const formData = new FormData(formMsg);

			// get the message value and tool type
			let sentValue = formData.get('sent_message');

			// alerts if the message length is <= 5
			if (sentValue.length <= 5) {
				alertMessage("error", "Please input text at least 5 characters!");
				return;
			}

			// create sender label
			const senderLabel = document.createElement('div');
			senderLabel.classList.add('name-sender');
			senderLabel.textContent = "Lavranz";

			const msgProfSend = document.createElement('div');
			msgProfSend.id = 'msgProfSend';

			// create a new message element for sender
			const sendCapsule = document.createElement('div');
			sendCapsule.id = 'sendCapsule';
			sendCapsule.textContent = sentValue;

			// Create a imageDiv element for sender
			const msgImgSend = document.createElement('img');
			msgImgSend.src = 'images/dummy-user-profile.jpg';
			msgImgSend.alt = 'User Profile';

			msgProfSend.appendChild(sendCapsule);
			msgProfSend.appendChild(msgImgSend);

			// add the message element to the message block container
			messageContainer.appendChild(senderLabel);
			messageContainer.appendChild(msgProfSend);

			// the scrollbar will always on the bottom
			messageContainer.scrollTop = messageContainer.scrollHeight;

			// alerts after the message was sent successfully
			alertMessage("success", "Message sent successfully!");

			// creating message reply
			// const response = await window.axios.openAI(sentValue);
			// getReply = JSON.stringify(response.choices[0].text).replace(/\\n/g, '').replace(/"/g, '');
			// let replyValue = getReply;

			
			let replyValue = "dummy";
			// insertSupabase(sentValue,replyValue);

			if(replyValue){
				const receiver = document.createElement('div');
				receiver.classList.add('name-receiver');
				receiver.textContent = receiverName.innerText;

				const msgProfReply = document.createElement('div');
				msgProfReply.id = 'msgProfReply';

				// create a new message element for receiver
				const replyCapsule = document.createElement('div');
				replyCapsule.id = 'replyCapsule';
				replyCapsule.textContent = replyValue;

				// Create a imageDiv element for receiver
				const msgImgReply = document.createElement('img');
				msgImgReply.src = 'images/anime-boy.png';
				msgImgReply.alt = 'Reply Profile';

				msgProfReply.appendChild(msgImgReply);
				msgProfReply.appendChild(replyCapsule);
				
				// add the message element to the message block container
				messageContainer.appendChild(receiver);
				messageContainer.appendChild(msgProfReply);
				messageContainer.scrollTop = messageContainer.scrollHeight;

				// clear the input textfield
				const input = document.getElementById('message-inputSent');
				input.value = '';

				// alerts when receiving message
				alertMessage("inbox", "You receive a reply from " + receiverName.innerText + "!");
			}
		} catch (e){
			console.log(e);
			alertMessage("error", "Message sent unsuccessfully!");
		}
	}
}


// insert the message values to the SupaBase
async function insertSupabase(sentValue,replyValue) {
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
        msg_sent: sentValue,
        msg_reply: replyValue,
        created_at: new Date().toISOString()
    });
}

// alert toastify
function alertMessage(status, message){
	window.Toastify.showToast({
		text: message,
		duration: 2500,
		stopOnFocus: true,
		className: 'alert-message',
		style: {
			textAlign: "center",
			background: status == "error" ? "red" : status == "inbox" ? "#5100ff" : "green",
			color: "white",
			padding: "10px",
		},
	});
}

// edit receiver profile name
document.addEventListener("DOMContentLoaded", function() {
	var editIcon = document.getElementById("edit-icon");
  
	editIcon.addEventListener("click", function() {
		var currentValue = receiverName.innerText;
		var inputElement = document.createElement("input");
		inputElement.classList.add('form-control');
		inputElement.type = "text"
		inputElement.id = "edit-name"
		editIcon.innerHTML = "done_outline";
	
		receiverName.innerHTML = ""; // Clear the receiverName content
		receiverName.appendChild(inputElement);
		
		inputElement.addEventListener("blur", function () {
			var updatedValue = inputElement.value;
			editIcon.innerHTML = "edit";
			if(inputElement.value.length == 0){
				receiverName.innerText = currentValue;
			}
			else{
				receiverName.innerText = updatedValue;
			}
		});
	});
});
  
  