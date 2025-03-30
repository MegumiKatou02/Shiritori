import { useState, useRef, useEffect } from 'react'
import React from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedText, setCopiedText] = useState('')
  const notificationTimeoutRef = useRef<number | null>(null)

  const list = async (word: string) => {
    if (!word.trim()) return;
    
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vietnamese-dictionary-api.vercel.app';

      const response = await axios.get(`${API_BASE_URL}/api/search`, {
        params: {
          word,
          suggestion: true
        }
      });
      
      setResults(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      list(inputValue);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      setCopiedText(text);
      setIsCopied(true);
      
      notificationTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  }

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
  }, []);

  return (
    <div className="dictionary-container">
      <h1 className="app-title">Từ điển Tiếng Việt</h1>
      
      <div className="search-container">
        <input 
          className="search-input"
          type="text" 
          value={inputValue} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          placeholder="Nhập từ cần tra cứu..." 
        />
      </div>
      
      {isLoading ? (
        <div className="loading">Đang tìm kiếm...</div>
      ) : results.length > 0 ? (
        <div className="results-grid">
          {results.map((result, index) => (
            <div 
              key={index} 
              className="result-item"
              onClick={() => copyToClipboard(result)}
            >
              <span className="word-text">{result}</span>
              <span className="copy-icon">⧉</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-grid">
          {inputValue.trim() 
            ? "Không tìm thấy kết quả" 
            : "Nhập từ khóa để tìm kiếm"}
        </div>
      )}
      
      <div className={`copy-notification ${isCopied ? 'visible' : ''}`}>
        Đã sao chép "{copiedText}" vào clipboard!
      </div>
    </div>
  )
}

export default App