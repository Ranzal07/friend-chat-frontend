const form = document.getElementById("form_message");
if (form) {
    form.onsubmit = async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        const response = await window.axios.openAI(formData.get("message"));
        document.getElementById("reply_message").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
        for (const [key, value] of formData) {
            // output.textContent += `${key}: ${value}\n`;
        }
    };
}