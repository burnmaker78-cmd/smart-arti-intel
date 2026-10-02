'use client';

import { useState, useRef } from 'react';
import { Paperclip, Send, Key } from 'lucide-react';

export default function StaticChat() {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Link Trigger
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFiles((prev) => [
          ...prev,
          { name: file.name, url: reader.result as string, type: file.type }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Safe client call directly over public endpoints
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;
    if (!apiKey) {
      alert('Please enter your OpenAI API key first!');
      return;
    }

    const userMessageContent = input;
    const userMessageId = Math.random().toString();
    
    // Structure message list state updates
    const updatedMessages = [
      ...messages,
      { id: userMessageId, role: 'user' as const, content: userMessageContent }
    ];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Context formatting setup for Multimodal evaluation
    const contentPayload: any[] = [{ type: 'text', text: userMessageContent }];
    attachedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        contentPayload.push({
          type: 'image_url',
          image_url: { url: file.url }
        });
      } else {
        contentPayload.push({
          type: 'text',
          text: `[Attached File Context: ${file.name}]`
        });
      }
    });

    setAttachedFiles([]);

    try {
      const response = await fetch('https://openai.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), role: 'assistant', content: aiReply }
      ]);
    } catch (error) {
      console.error(error);
      alert('Failed to connect to OpenAI. Check your API key or connection settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 justify-between font-sans text-black bg-white">
      {/* Key Input Section */}
      <div className="flex items-center gap-2 p-2 border border-yellow-300 bg-yellow-50 rounded-lg mb-4">
        <Key size={18} className="text-yellow-600" />
        <input
          type="password"
          placeholder="Paste OpenAI API Key here (stored only in browser memory)..."
          className="flex-1 text-xs p-1 bg-transparent focus:outline-none"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      {/* Main UI Console Window */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">Paste your API key, append files, and prompt the AI.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-white border border-gray-300'}`}>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {loading && <p className="text-xs text-gray-400 italic">Thinking intelligently...</p>}
      </div>

      <form onSubmit={handleSend} className="space-y-2">
        {attachedFiles.length > 0 && (
          <div className="flex gap-2 flex-wrap p-2 border border-dashed border-gray-300 rounded-md bg-white">
            {attachedFiles.map((file, idx) => (
              <span key={idx} className="bg-gray-200 text-xs px-2 py-1 rounded text-gray-700 max-w-[150px] truncate">
                📎 {file.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            className="hidden" 
            accept="image/*,application/pdf,text/*"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition"
          >
            <Paperclip size={20} />
          </button>

          <input
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={input}
            placeholder="Send a prompt..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
