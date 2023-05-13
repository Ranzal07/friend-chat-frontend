const form = document.getElementById("form_message");
if (form) {
    form.onsubmit = async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        let sentence = formData.get("message");
        if (sentence.length <= 5){
            alertMessage("error","Please input at least 5 characters");
            return;    
        }
        
        // const response = await window.axios.openAI(formData.get("message"));
        // document.getElementById("reply_message").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
        // for (const [key, value] of formData) {
        //     // output.textContent += `${key}: ${value}\n`;
        // }
    };
}

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