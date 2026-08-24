"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getStudentProfilePhoto,
  prepareStudentProfilePhoto,
  removeStudentProfilePhoto,
  saveStudentProfilePhoto,
  studentProfilePhotoStorageKey,
  studentProfilePhotoUpdatedEvent,
} from "@/lib/student/profile-photo";
import { cn } from "@/lib/utils";

function useStudentProfilePhoto() {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const refreshPhoto = () => setPhoto(getStudentProfilePhoto());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === studentProfilePhotoStorageKey) refreshPhoto();
    };

    refreshPhoto();
    window.addEventListener(studentProfilePhotoUpdatedEvent, refreshPhoto);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(studentProfilePhotoUpdatedEvent, refreshPhoto);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return photo;
}

export function StudentAvatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  const photo = useStudentProfilePhoto();

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/16 font-bold",
        className,
      )}
    >
      {photo ? (
        <Image src={photo} alt="Foto de perfil del estudiante" fill sizes="96px" unoptimized className="object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export function StudentProfilePhotoEditor({ initials }: { initials: string }) {
  const photo = useStudentProfilePhoto();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setProcessing(true);
    setMessage("");

    try {
      const preparedPhoto = await prepareStudentProfilePhoto(file);
      saveStudentProfilePhoto(preparedPhoto);
      setMessage("Foto de perfil actualizada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos guardar la imagen.");
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    removeStudentProfilePhoto();
    setMessage("Foto eliminada. Volvemos a mostrar tus iniciales.");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <StudentAvatar
          initials={initials}
          className="h-28 w-28 bg-primary/8 text-3xl font-black text-primary ring-4 ring-white shadow-lg"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={photo ? "Cambiar foto de perfil" : "Subir foto de perfil"}
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={() => inputRef.current?.click()} disabled={processing}>
          <Upload className="h-4 w-4" />
          {processing ? "Procesando…" : photo ? "Cambiar foto" : "Subir foto"}
        </Button>
        {photo ? (
          <Button type="button" variant="outline" onClick={handleRemove} disabled={processing}>
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        ) : null}
      </div>

      <p className="mt-3 max-w-sm text-center text-xs leading-5 text-muted-foreground">
        Usa una imagen JPG, PNG o WEBP de máximo 5 MB. Se recortará en formato cuadrado.
      </p>
      <p aria-live="polite" className="mt-2 min-h-5 text-center text-sm font-semibold text-primary">
        {message}
      </p>
    </div>
  );
}
