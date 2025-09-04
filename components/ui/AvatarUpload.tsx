'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCamera, FiX, FiCheck } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarUpload({
  currentAvatar,
  onAvatarUpdate,
  className = '',
  size = 'md'
}: AvatarUploadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setError(null);
    setSuccess(false);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!user || !preview) return;

    setIsUploading(true);
    setError(null);

    try {
      // Convertir base64 a blob
      const response = await fetch(preview);
      const blob = await response.blob();

      // Crear nombre único para el archivo
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${blob.type.split('/')[1]}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Guardar información en la base de datos
      const { data: avatarData, error: dbError } = await supabase
        .from('user_avatars')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_size: blob.size,
          file_type: blob.type,
          storage_path: uploadData.path,
          public_url: publicUrl,
          is_primary: true
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Establecer como avatar primario usando la función de PostgreSQL
      const { error: primaryError } = await supabase.rpc('set_primary_avatar', {
        user_uuid: user.id,
        avatar_uuid: avatarData.id
      });

      if (primaryError) {
        console.error('Error setting primary avatar:', primaryError);
        // No es crítico, continuar
      }

      // Actualizar el perfil del usuario
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
      }

      // Registrar actividad
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: user.id,
          action_type: 'avatar_upload',
          description: 'Subió una nueva foto de perfil',
          metadata: { file_name: fileName, file_size: blob.size }
        });

      setSuccess(true);
      setPreview(null);
      onAvatarUpdate?.(publicUrl);

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-700 rounded-full flex items-center justify-center`}>
        <FiCamera className={`${iconSizes[size]} text-gray-500`} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full overflow-hidden border-2 border-gray-600 hover:border-primary-500 transition-colors cursor-pointer group`}
        onClick={handleFileSelect}
      >
        {(preview || currentAvatar) ? (
          <img
            src={preview || currentAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiCamera className={`${iconSizes[size]} text-gray-400 group-hover:text-primary-400 transition-colors`} />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <FiUpload className={`${iconSizes[size]} text-white`} />
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Actions */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-2 -right-2 flex space-x-1"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={uploadAvatar}
            disabled={isUploading}
            className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiCheck className="w-4 h-4" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={cancelUpload}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 left-0 right-0 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 left-0 right-0 bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-green-400 text-sm"
        >
          ¡Foto de perfil actualizada!
        </motion.div>
      )}
    </div>
  );
}

// Componente simplificado para mostrar avatar sin funcionalidad de subida
interface AvatarDisplayProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarDisplay({
  src,
  alt = 'Avatar',
  fallback = '👤',
  size = 'md',
  className = ''
}: AvatarDisplayProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full overflow-hidden border border-gray-600`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl">
          {fallback}
        </div>
      )}
    </div>
  );
}
