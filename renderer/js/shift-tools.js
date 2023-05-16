document.addEventListener('DOMContentLoaded', () => {
    const heading = document.getElementById('heading');
    const friendChatRadio = document.getElementById('flexRadioDefault1');
    const interviewQuestionsRadio = document.getElementById('flexRadioDefault2');
  
    friendChatRadio.addEventListener('change', () => {
        if (friendChatRadio.checked) {
            heading.textContent = 'Friend Chat';
        }
    });
  
    interviewQuestionsRadio.addEventListener('change', () => {
        if (interviewQuestionsRadio.checked) {
            heading.textContent = 'Interview Questions';
        }
    });
  
    const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
        event.preventDefault();
        ipcRenderer.send('radioChoice', heading.textContent);
    });
});