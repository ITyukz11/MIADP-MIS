'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import type { NextPage } from 'next';
import type { Message, User } from '@prisma/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

const socket = io();

interface ChatMessage extends Message {
  user: User;
}

const Chat: NextPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<User[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get<ChatMessage[]>('/api/messages');
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    const handleMessage = (msg: ChatMessage) => {
      setMessages((prevMessages) => [msg, ...prevMessages]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get<User[]>('/api/contacts');
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const sendMessage = async () => {
    if (message) {
      try {
        const { data } = await axios.post<ChatMessage>('/api/messages', { content: message });
        socket.emit('message', data);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex gap-2 min-h-[70vh]">
      <Card className="w-1/4 p-4 flex flex-col">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
          placeholder="Search contacts..."
        />
        <div className="flex-1">
          {contacts.filter(contact => contact.name.toLowerCase().includes(search.toLowerCase())).map((contact) => (
            <div key={contact.id} className="p-2 border-b">
              {contact.name}
            </div>
          ))}
        </div>
      </Card>
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-1 mb-4 p-4">
          {messages.map((msg) => (
            <div key={msg.id} className="message p-2 border-b">
              <strong>{msg.user.name}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 mr-2"
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
