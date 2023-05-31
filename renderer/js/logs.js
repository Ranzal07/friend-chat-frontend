// Read Prompts from SupaBase
getPrompts();
async function getPrompts () {
    // Fetch API Response
    const response = await window.axios.supaBase('get');

    // Load table from API Response
    let htmlResult = '';
    Object.keys(response).forEach(key => {
        let date = new Date(response[key].created_at.replace(' ', 'T'));

        htmlResult += '<tr>' +
            '<td scope="row">' +  response[key].prompt_id + '</td>' +
            '<td>' + response[key].msg_sent + '</td>' +
            '<td>' + response[key].msg_reply + '</td>' +
            '<td>' + date.toLocaleString('en-US', { timeZone: 'UTC' }) + '</td>' +
            '<td>' + 
                '<div class="btn-group" role="group">' +
                    '<button type="button" id="btn_prompts_del" class="btn btn-danger" aria-expanded="false" name="' + response[key].prompt_id + '">' +
                        'Delete' +
                    '</button>' +
                '</div>' +
        '</tr>';
    });

    const tbody = document.getElementById('tbl_prompts');
    tbody.innerHTML = htmlResult;
}

// Set Btn Delete Prompt Click functionality from Table Prompts
const tbl_prompts = document.getElementById('tbl_prompts');
if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
        if(e.target && e.target.id == "btn_prompts_del") {
            const id = e.target.name;
            await window.axios.supaBase('delete', id);
            getPrompts();
            alertMessage("success", "Successfully deleted ID " + id + '!');
        }
    };
}

function alertMessage(status, message){
    window.Toastify.showToast({
        text: message,
        duration: 3000,
        stopOnFocus: true,
        className: 'alert-message-logs',
        style: {
            textAlign: "center",
            background: status == "error" ? "red" : "green",
            color: "white",
            padding: "5px",
            marginTop: "2px",
        },
      });
}