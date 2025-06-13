"use client";

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Download, Trash2, AlertTriangle, Loader2, RefreshCw, Calendar, Eye, Search, Play, Mic as MicIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { QueueStatus } from "@/components/ui/queue-status";

interface GalleryItem {
  id: string;
  prompt: string;
  url: string;
  type: 'image' | 'video' | 'lip_sync' | 'audio';
  duration?: number;
  aspect_ratio?: string;
  created_at: string;
  expires_at: string;
  isLipSync?: boolean;
  isAudio?: boolean;
  metadata?: any;
}

const galleryTexts = {
  title: "Media Gallery",
  subtitle: "Explore and manage your AI creations",
  noItems: "No media found",
  noItemsDescription: "Your generated images and videos will appear here. Create your first masterpiece!",
  createFirst: "Create First Media",
  searchPlaceholder: "Search by prompt...",
  totalItems: "items",
  downloadButton: "Download",
  deleteButton: "Delete",
  deleteConfirm: "Are you sure you want to delete this item?",
  downloading: "Downloading media...",
  downloadSuccess: "Media downloaded successfully!",
  downloadError: "Failed to download media",
  deleting: "Deleting media...",
  deleteSuccess: "Media deleted successfully!",
  deleteError: "Failed to delete media",
  loadingItems: "Loading your masterpieces...",
  refreshGallery: "Refresh Gallery",
  expiresIn: "Expires in",
  expired: "Expired",
  days: "days",
  hours: "hours",
  minutes: "minutes",
  createdAt: "Created on",
  image: "Image",
  video: "Video",
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.items || []);
      setFilteredItems(data.items || []);
    } catch (error: any) {
      console.error('Erro ao carregar itens:', error);
      toast.error("Failed to load gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleDownload = async (itemUrl: string, prompt: string, type: 'image' | 'video' | 'lip_sync' | 'audio') => {
    try {
      const response = await fetch(itemUrl);
      const blob = await response.blob();
      
      let filename: string;
      let extension: string;
      
      if (type === 'image') {
        extension = 'png';
        filename = `generated-image-${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.${extension}`;
      } else if (type === 'audio') {
        extension = 'wav';
        filename = `generated-audio-${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.${extension}`;
      } else if (type === 'lip_sync') {
        extension = 'mp4';
        filename = `lip-sync-${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.${extension}`;
      } else {
        extension = 'mp4';
        filename = `generated-video-${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.${extension}`;
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (itemId: string, itemType: 'image' | 'video' | 'lip_sync' | 'audio') => {
    const confirmed = window.confirm(`Are you sure you want to delete this ${itemType}?`);
    if (!confirmed) return;

    try {
      // Map audio type to video for deletion since we store audio in video metadata
      let deleteType = itemType;
      if (itemType === 'lip_sync' || itemType === 'audio') {
        deleteType = 'video';
      }

      const response = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: itemId, 
          type: deleteType 
        }),
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
        toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`);
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) {
      return galleryTexts.expired;
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} ${galleryTexts.days}`;
    } else if (diffHours > 0) {
      return `${diffHours} ${galleryTexts.hours}`;
    } else {
      return `${diffMinutes} ${galleryTexts.minutes}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 mr-4">
                  <Video className="w-8 h-8 text-cyan-300" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {galleryTexts.title}
                  </h1>
                  <p className="text-gray-400 mt-1">{galleryTexts.subtitle}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={fetchItems}
              variant="outline"
              className="text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black transition-all duration-300"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {galleryTexts.refreshGallery}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={galleryTexts.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>

          {/* Queue Status */}
          <div className="mt-6">
            <QueueStatus />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-gray-400 text-lg">{galleryTexts.loadingItems}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              {items.length === 0 ? (
                <Video className="w-12 h-12 text-gray-500" />
              ) : (
                <Search className="w-12 h-12 text-gray-500" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {items.length === 0 ? galleryTexts.noItems : "No results found"}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {items.length === 0 
                ? galleryTexts.noItemsDescription 
                : "Try adjusting your search terms or create new content."}
            </p>
            {items.length === 0 && (
              <Button
                variant="outline"
                className="text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black transition-all duration-300"
                onClick={() => window.location.href = '/tools/image-generation'}
              >
                {galleryTexts.createFirst}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                <span className="font-medium text-cyan-300">{filteredItems.length}</span> {galleryTexts.totalItems}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const isExpired = new Date(item.expires_at) <= new Date();
                
                return (
                  <div
                    key={item.id}
                    className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
                  >
                    {/* Media */}
                    <div className="aspect-square relative overflow-hidden">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.prompt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onClick={() => openModal(item)}
                        />
                      ) : item.type === 'audio' ? (
                        <div className="relative w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex flex-col items-center justify-center">
                          <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4">
                            <MicIcon className="w-12 h-12 text-purple-300" />
                          </div>
                          <p className="text-xs text-gray-300 text-center px-2">Audio Generated</p>
                          <p className="text-xs text-purple-300 text-center px-2 mt-1">
                            {item.metadata?.language ? `Language: ${item.metadata.language.toUpperCase()}` : ''}
                          </p>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={item.url}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            muted
                            onClick={() => openModal(item)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openModal(item)}
                          className="bg-cyan-500/90 text-black hover:bg-cyan-600 hover:text-black border border-cyan-400/50 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {item.type === 'audio' ? 'Listen' : 'View'}
                        </Button>
                      </div>
                      {isExpired && (
                        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                          {galleryTexts.expired}
                        </div>
                      )}
                      {/* Type badge */}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {item.type === 'image' ? (
                          <ImageIcon className="w-3 h-3" />
                        ) : item.type === 'audio' ? (
                          <MicIcon className="w-3 h-3" />
                        ) : item.isLipSync ? (
                          <>
                            <MicIcon className="w-3 h-3" />
                            <span>Lip Sync</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                          </>
                        )}
                        {item.type === 'image' && galleryTexts.image}
                        {item.type === 'audio' && 'Audio'}
                        {item.type === 'video' && !item.isLipSync && galleryTexts.video}
                        {item.type === 'video' && item.duration && (
                          <span>• {item.duration}s</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                      
                      <div className="text-xs text-gray-400 mb-3">
                        <div className="flex items-center mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {galleryTexts.createdAt}: {formatDate(item.created_at)}
                        </div>
                        <div className={`${isExpired ? 'text-red-400' : 'text-yellow-400'}`}>
                          {galleryTexts.expiresIn}: {formatTimeRemaining(item.expires_at)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(item.url, item.prompt, item.type)}
                          className="flex-1 text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black transition-all duration-300"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {galleryTexts.downloadButton}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id, item.type)}
                          className="px-3 bg-red-600/80 hover:bg-red-700 border border-red-500/50 text-black hover:text-black transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Modal for Media Preview */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="relative max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-black hover:bg-white/20 hover:text-black transition-all duration-300"
                >
                  ✕
                </Button>
              </div>
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.prompt}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : selectedItem.type === 'audio' ? (
                <div className="p-8 text-center">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-8 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4 inline-flex">
                      <MicIcon className="w-16 h-16 text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generated Audio</h3>
                    <p className="text-gray-300 mb-4">{selectedItem.prompt}</p>
                    {selectedItem.metadata?.language && (
                      <p className="text-purple-300 text-sm mb-4">
                        Language: {selectedItem.metadata.language.toUpperCase()}
                      </p>
                    )}
                    <audio 
                      controls 
                      className="w-full max-w-md mx-auto"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    >
                      <source src={selectedItem.url} type="audio/wav" />
                      <source src={selectedItem.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleDownload(selectedItem.url, selectedItem.prompt, selectedItem.type)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Audio
                    </Button>
                  </div>
                </div>
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="max-w-full max-h-[70vh] object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="p-6">
                <p className="text-white text-lg mb-4">{selectedItem.prompt}</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleDownload(selectedItem.url, selectedItem.prompt, selectedItem.type)}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-black hover:text-black font-semibold transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {galleryTexts.downloadButton}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedItem.id, selectedItem.type);
                      closeModal();
                    }}
                    className="bg-red-600/80 hover:bg-red-700 border border-red-500/50 text-black hover:text-black transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {galleryTexts.deleteButton}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 