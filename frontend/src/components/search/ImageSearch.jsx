import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaSearch, FaSpinner, FaInfoCircle, FaUpload, FaLink } from 'react-icons/fa';

function ImageSearch({ onSearch, isSearching }) {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'upload'
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim() && !isSearching) {
      onSearch('image', imageUrl.trim());
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded bg-neon-pink/20">
          <FaImage className="text-2xl text-neon-pink" />
        </div>
        <div>
          <h3 className="text-lg font-cyber text-white">Reverse Image Search</h3>
          <p className="text-sm text-cyber-gray-400">
            Find image matches across the web and social platforms
          </p>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${
            inputMode === 'url'
              ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
              : 'bg-cyber-gray-600/20 text-cyber-gray-400 border border-cyber-gray-600'
          }`}
        >
          <FaLink /> URL
        </button>
        <button
          onClick={() => setInputMode('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${
            inputMode === 'upload'
              ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
              : 'bg-cyber-gray-600/20 text-cyber-gray-400 border border-cyber-gray-600'
          }`}
        >
          <FaUpload /> Upload
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMode === 'url' ? (
          <div>
            <label className="block text-sm text-cyber-gray-400 mb-2 font-mono">
              IMAGE URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              className="cyber-input w-full rounded"
              disabled={isSearching}
            />
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-cyber-gray-600 rounded-lg p-8 text-center hover:border-neon-pink/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <FaUpload className="text-4xl text-cyber-gray-500 mx-auto mb-3" />
            <p className="text-cyber-gray-400">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-cyber-gray-500 mt-2">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </div>
        )}

        {/* Image Preview */}
        {previewUrl && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto rounded border border-cyber-gray-600"
              onError={() => setPreviewUrl(null)}
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setImageUrl('');
              }}
              className="absolute top-2 right-2 p-1 bg-cyber-dark-900 rounded text-cyber-gray-400 hover:text-neon-pink"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-start gap-2 text-xs text-cyber-gray-400">
          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
          <p>
            Reverse image search uses Google, TinEye, and Yandex to find matching 
            images across the web and social media platforms.
          </p>
        </div>

        <button
          type="submit"
          disabled={!imageUrl.trim() || isSearching}
          className="cyber-button w-full rounded flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Initiate Image Search</span>
            </>
          )}
        </button>
      </form>

      {/* Search Engines */}
      <div className="mt-6 pt-4 border-t border-cyber-gray-600">
        <p className="text-xs text-cyber-gray-500 mb-3">SEARCH ENGINES:</p>
        <div className="flex flex-wrap gap-2">
          {['Google Vision', 'TinEye', 'Yandex', 'Bing Visual'].map((engine) => (
            <span
              key={ engine}
              className="px-2 py-1 text-xs rounded bg-cyber-gray-600/30 text-cyber-gray-400 border border-cyber-gray-600"
            >
              {engine}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageSearch;
