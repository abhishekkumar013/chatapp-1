import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    wsRef.current = ws;

    ws.onmessage = (e) => {
      setAllMessages((msg) => [...msg, e.data]);
      console.log(allMessages);
    };
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Chat display area */}
      <div className="flex-1 overflow-auto p-4">
        {/* You can add message bubbles here */}
        <div className="flex flex-col gap-2">
          {allMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 max-w-xs break-words rounded-lg ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-700 text-white self-start"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="p-4 flex-1 bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={() => {
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );
              setMessage("");
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 font-medium transition-colors cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
