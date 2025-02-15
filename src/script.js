document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const inputBox = document.getElementById("input-box");
    const sendBtn = document.getElementById("send-btn");

    // 🔹 ページ読み込み時に履歴を復元
    const messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    messages.forEach(msg => chatBox.innerHTML += msg);
    chatBox.scrollTop = chatBox.scrollHeight;  // 最下部へスクロール

    // 🔹 Enterキーで送信
    inputBox.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendBtn.click();
    });

    // 🔹 メッセージ送信処理
    sendBtn.addEventListener("click", async () => {
        const userMessage = inputBox.value.trim();
        if (!userMessage) return;

        // ユーザーの吹き出しを追加
        const userHtml = `<div class="self-end bg-blue-500 text-white p-3 rounded-lg max-w-xs shadow-lg">
            👤 ${userMessage}
        </div>`;
        chatBox.innerHTML += userHtml;
        inputBox.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

        // GPTの「入力中…」を表示
        const loadingHtml = `<div id="loading" class="self-start bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs shadow-lg">
            🤖 入力中…
        </div>`;
        chatBox.innerHTML += loadingHtml;
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [{ role: "user", content: userMessage }] })
            });

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            // 「入力中…」を削除してGPTのメッセージを追加
            document.getElementById("loading").remove();
            const botHtml = `<div class="self-start bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs shadow-lg">
                🤖 ${botMessage}
            </div>`;
            chatBox.innerHTML += botHtml;
            chatBox.scrollTop = chatBox.scrollHeight;

            // ローカルストレージに履歴を保存
            const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
            history.push(userHtml, botHtml);
            localStorage.setItem("chatHistory", JSON.stringify(history));

        } catch (error) {
            console.error("Error:", error);
            document.getElementById("loading").remove();
            chatBox.innerHTML += `<div class="self-start bg-red-500 text-white p-3 rounded-lg max-w-xs shadow-lg">
                ❌ エラーが発生しました
            </div>`;
        }
    });
});

document.getElementById('clear-btn').addEventListener('click', function () {
    document.getElementById('chat-box').innerHTML = ''; // チャット履歴を空にする
    localStorage.removeItem('chatHistory'); // ローカルストレージの履歴も削除
});
