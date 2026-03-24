import { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../utils/api';

export default function Chat({ shipment, onBack }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  const otherUser = user.role === 'seller'
    ? shipment.matchedTransporter
    : shipment.seller;

  const receiverId = otherUser?._id;

  useEffect(() => {
    API.get(`/messages/${shipment._id}`).then(r => setMessages(r.data)).catch(() => {});

    if (socket) {
      socket.emit('joinShipmentChat', shipment._id);
      socket.on('newMessage', (msg) => {
        if (msg.shipmentRequest === shipment._id) {
          setMessages(prev => [...prev, msg]);
        }
      });

      return () => {
        socket.emit('leaveShipmentChat', shipment._id);
        socket.off('newMessage');
      };
    }
  }, [shipment._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      const res = await API.post('/messages', {
        receiver: receiverId,
        shipmentRequest: shipment._id,
        content: newMsg.trim()
      });
      setMessages(prev => [...prev, res.data]);
      setNewMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="chat-header-bar" style={{ background: 'var(--bg-secondary)' }}>
        <button onClick={onBack} style={{ background: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
          <FiArrowLeft />
        </button>
        <div>
          <div style={{ fontWeight: 600 }}>{otherUser?.name || 'Unknown'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {shipment.sourceCity} → {shipment.destinationCity} • {otherUser?.role}
          </div>
        </div>
      </div>

      {/* Shipment info bar */}
      <div style={{ padding: '12px 24px', background: 'rgba(108, 60, 225, 0.08)', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
        📦 <strong>{shipment.productDescription}</strong> {shipment.weight && `• ${shipment.weight}`}
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1 }}>
        {messages.length === 0 && (
          <div className="empty-state" style={{ padding: '40px' }}>
            <div className="empty-icon">💬</div>
            <h3>Start the conversation</h3>
            <p>Discuss shipment details, timing, and pricing</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={msg._id || i} className={`chat-message ${msg.sender?._id === user._id || msg.sender === user._id ? 'sent' : 'received'}`}>
            {msg.content}
            <div className="msg-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-bar" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          autoFocus
        />
        <button type="submit"><FiSend /></button>
      </form>
    </div>
  );
}
