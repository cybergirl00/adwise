'use client'

import { useState } from 'react'
import { CloudUpload, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { UploadButton } from '@/utils/uploadthing'

interface UploadDropzoneProps {
  onClientUploadComplete?: (res: any[]) => void
  onUploadError?: (error: any) => void
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onClientUploadComplete,
  onUploadError
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleUploadComplete = (res: any[]) => {
    console.log("Files: ", res)
    if (res && res.length > 0) {
      // Use ufsUrl instead of url
      const fileUrl = res[0].ufsUrl || res[0].url
      setPreviewUrl(fileUrl)
      
      // Enhanced file type detection
      const url = fileUrl.toLowerCase()
      const isVideo = url.match(/\.(mp4|mov|avi|webm|mkv)$/) !== null
      setFileType(isVideo ? 'video' : 'image')
    }
    onClientUploadComplete?.(res)
  }

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error)
    alert(`ERROR! ${error.message}`)
    onUploadError?.(error)
  }

  const clearPreview = () => {
    setPreviewUrl(null)
    setFileType(null)
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      )}
      onDragEnter={() => setIsDragActive(true)}
      onDragLeave={() => setIsDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
    >
      {previewUrl ? (
        <div className="relative w-full h-40">
          {fileType === 'image' ? (
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover rounded-md"
              unoptimized
            />
          ) : (
            <video
              src={previewUrl}
              className="w-full h-full object-cover rounded-md"
              controls
              autoPlay
              muted
            />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              clearPreview()
            }}
            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <CloudUpload className="w-8 h-8 text-primary" />
          {isDragActive ? (
            <p>Drop your file here…</p>
          ) : (
            <p>Drag & drop media here, or click to select</p>
          )}
          <p className="text-xs text-muted-foreground">
            Supports: PNG, JPG, MP4, MOV, AVI, WEBM, MKV up to 32MB
          </p>
          
          <div className="mt-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              appearance={{
                button: {
                  width: '100%',
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}