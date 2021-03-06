import React, { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";

export function MessageForm(props) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useImmer([]);
    const ws = useRef(null);

    useEffect(()=>{
        console.log('Using Effect')
        ws.current = new WebSocket('ws://chat-server-gg.herokuapp.com')

        ws.current.onopen = function (event) {
            console.log('Opening Socket');
        };

        ws.current.onmessage = e => {
            console.log('event data', e.data)
            setMessages(messages =>{
                messages.push(e.data)
            });
        };
        return () => {
             ws.current.close();
        }
    }, []);


    const handleSubmit = (evt) => {
        evt.preventDefault();
        ws.current.send(message);
    }

    const chatMessages = messages.map((msg,index) =>
        <li key={index}>
            {msg}
        </li>
    )


    return (
        <div>
        <h3>Amazing Chat</h3>
        <form onSubmit={handleSubmit}>
            <label>
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
            </label>
            <input type="submit" value="Submit" />
        </form>
            <h3>Super Capitalism Feed:</h3>
            <ul>{chatMessages}</ul>
        </div>
    );
}