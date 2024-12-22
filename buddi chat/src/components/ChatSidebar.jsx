import React from 'react';

const ChatSidebar = ({ chatRooms, onRoomSelect }) => {
  return (
    <aside className="chat-sidebar">
      <h3>Chat Rooms</h3>
      <ul>
        {chatRooms.map((room, index) => (
          <li key={index} onClick={() => onRoomSelect(room)}>
            {room}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
