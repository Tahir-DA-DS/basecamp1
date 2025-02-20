const threadId = new URLSearchParams(window.location.search).get("Id");

// Load Messages
async function loadMessages() {
    const response = await fetch(`/threads/${threadId}/messages`);
    const messages = await response.json();

    document.getElementById("threadTitle").innerText = messages.threadTitle;
    
    const list = document.getElementById("messageList");
    list.innerHTML = "";
    messages.messages.forEach(msg => {
        list.innerHTML += `<li>${msg.user}: ${msg.content}</li>`;
    });
}

// Send Message
async function sendMessage() {
    const content = document.getElementById("messageInput").value;
    if (!content) return alert("Message cannot be empty!");

    await fetch(`/threads/${threadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    loadMessages();
}

loadMessages();