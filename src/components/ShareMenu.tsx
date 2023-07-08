import React from 'react';
import { toast } from 'react-toastify';

interface ShareMenuProps {
  onClose: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ onClose }) => {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    onClose();
  };

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    onClose();
  };

  const shareOnWhatsApp = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    onClose();
  };

  const shareOnReddit = () => {
    const shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    onClose();
  };

  const shareOnDiscord = () => {
    const shareUrl = `https://discord.com/channels/@me?`;
    window.open(shareUrl, '_blank');
    onClose();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Link copied to clipboard');
        onClose();
      })
      .catch((error) => {
        toast.error('Failed to copy link to clipboard');
        console.error('Error copying link:', error);
      });
  };

  return (
    <ul className="share-menu flex flex-col gap-2 bg-white rounded-md shadow-md p-4">
      <li>
        <button
          className="share-option flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={shareOnFacebook}
        >
          <span>Share on Facebook</span>
        </button>
      </li>
      <li>
        <button
          className="share-option flex items-center gap-2 bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500"
          onClick={shareOnTwitter}
        >
          <span>Share on Twitter</span>
        </button>
      </li>
      <li>
        <button
          className="share-option flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={shareOnWhatsApp}
        >
          <span>Share on WhatsApp</span>
        </button>
      </li>
      <li>
        <button
          className="share-option flex items-center gap-2 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          onClick={shareOnReddit}
        >
          <span>Share on Reddit</span>
        </button>
      </li>
      <li>
        <button
          className="share-option flex items-center gap-2 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          onClick={shareOnDiscord}
        >
          <span>Share on Discord</span>
        </button>
      </li>
      <li>
        <button
          className="share-option flex items-center gap-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          onClick={copyLink}
        >
          <span>Copy Link</span>
        </button>
      </li>
    </ul>
  );
};

export default ShareMenu;
