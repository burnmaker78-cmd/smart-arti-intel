'use client';

import { useChat } from 'ai/react';
import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);

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

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 justify-between font-sans">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">Ask anything, or use the chain button to link files/images!</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-white text-gray-800 border border-gray-300'}`}>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => {
        const experimental_attachments = attachedFiles.map(f => ({ url: f.url, contentType: f.type }));
        handleSubmit(e, { experimental_attachments });
        setAttachedFiles([]);
      }} className="space-y-2">
        
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
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            value={input}
            placeholder="Send a message..."
            onChange={handleInputChange}
          />
          
          <button type="submit" className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
