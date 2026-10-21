import React, { useId, useState } from 'react';
import api from '../../services/api';
import type { DocumentoDTO } from '../../types/dtos';

interface FileUploadZoneProps {
  bemId?: string;
  vistoriaId?: string;
  categoria: string;
  onUploadSuccess: (documento: DocumentoDTO) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  bemId,
  vistoriaId,
  categoria,
  onUploadSuccess
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputId = useId();

  // Cálculo de Hash SHA-256 no cliente usando Web Crypto API
  const calcularSHA256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const uploadFile = async (file?: File) => {
    if (!file) return;

    // Validação de tamanho (Max 50MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('O arquivo excede o limite máximo permitido de 15 MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      // 1. Calcula o Hash SHA-256 do arquivo para integridade (Zero Bytea)
      const sha256 = await calcularSHA256(file);
      setProgress(40);

      // 2. Prepara FormData para upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('titulo', file.name);
      formData.append('categoria', categoria);
      formData.append('sha256', sha256);
      if (bemId) formData.append('bemId', bemId);
      if (vistoriaId) formData.append('vistoriaId', vistoriaId);

      setProgress(70);

      // 3. Envia para a API REST
      const response = await api.post<DocumentoDTO>('/v1/documentos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProgress(100);
      onUploadSuccess(response.data);
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar upload do arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await uploadFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    await uploadFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
      }`}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={inputId}
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg,.dwg"
        disabled={uploading}
      />
      <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center">
        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Clique ou arraste um laudo/planta em PDF ou imagem</span>
        <span className="text-xs text-gray-500 mt-1">Limite máximo: 15 MB • Cálculo de Integridade SHA-256 automático</span>
      </label>

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-xs text-gray-600 mt-1 block">Processando hash e transferindo... {progress}%</span>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};
