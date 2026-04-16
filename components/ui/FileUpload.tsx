'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, File, Image as ImageIcon, Film } from 'lucide-react';

export type UploadedFile = {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'video' | 'document';
};

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  maxFiles?: number;
  accept?: string;
  label?: string;
}

export function FileUpload({ 
  onUpload, 
  maxFiles = 5, 
  accept = "image/*,video/*,application/pdf",
  label = "Drag & drop files or click to upload"
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  // Clean up object URLs to avoid memory leaks for any temporary ones
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.previewUrl.startsWith('blob:')) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, [files]);

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.slice(0, maxFiles - files.length);
    setUploading(true);
    
    try {
      const uploadedResults = await Promise.all(validFiles.map(async file => {
        let type: UploadedFile['type'] = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        const serverUrl = data.success ? data.url : URL.createObjectURL(file);
        
        return {
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: serverUrl,
          type
        } as UploadedFile;
      }));

      const updated = [...files, ...uploadedResults];
      setFiles(updated);
      onUpload(updated);
    } catch (e) {
      console.error('File upload failed', e);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    onUpload(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Dropzone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--indigo-400)' : 'var(--border-dim)'}`,
          background: dragActive ? 'rgba(99,102,241,0.05)' : 'var(--bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
          textAlign: 'center'
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo-400)' }}>
          <UploadCloud size={24} />
        </div>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            {uploading ? 'Uploading...' : label}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Images, Videos, or PDFs up to 10MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
          {files.map(file => (
            <div key={file.id} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', aspectRatio: '1/1' }}>
              
              {file.type === 'image' && (
                <img src={file.previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {file.type === 'video' && (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'var(--text-muted)' }}>
                  <Film size={24} />
                </div>
              )}
              {file.type === 'document' && (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-muted)' }}>
                  <File size={24} />
                </div>
              )}

              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                style={{ 
                  position: 'absolute', top: 4, right: 4, 
                  width: 20, height: 20, borderRadius: '50%', 
                  background: 'rgba(0,0,0,0.6)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
