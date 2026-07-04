import { useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FileFieldConfig } from "../types";

interface Props {
    config: FileFieldConfig;
    field: ControllerRenderProps<FieldValues, string>;
    isDisabled: boolean;
}

export function FileField({ config, field, isDisabled }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [sizeError, setSizeError] = useState<string | null>(null);
    const value = field.value;
    const showPreview = config.preview !== false;

    const isMultipleFiles = Array.isArray(value) && value.length > 0;
    const isSingleFile = value instanceof File || typeof value === "string";
    const hasValue = isMultipleFiles || isSingleFile;

    const validateSize = (files: File[]): File[] => {
        if (!config.maxSizeMb) return files;
        const maxBytes = config.maxSizeMb * 1024 * 1024;
        const oversized = files.filter((f) => f.size > maxBytes);
        if (oversized.length > 0) {
            setSizeError(`File${oversized.length > 1 ? "s" : ""} exceed ${config.maxSizeMb}MB limit`);
            return files.filter((f) => f.size <= maxBytes);
        }
        setSizeError(null);
        return files;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files?.length) return;
        const valid = validateSize(Array.from(files));
        if (valid.length === 0) return;
        field.onChange(config.multiple ? valid : valid[0]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (isDisabled) return;
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isDisabled) setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleClear = () => {
        field.onChange(config.multiple ? [] : null);
        setSizeError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleRemoveFile = (index: number) => {
        if (!Array.isArray(value)) return;
        const next = value.filter((_: unknown, i: number) => i !== index);
        field.onChange(next.length > 0 ? next : []);
        if (next.length === 0 && inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className={cn("flex flex-col gap-2", config.inputClassName)}>
            <input
                ref={inputRef}
                id={`file-${field.name}`}
                type="file"
                accept={config.accept}
                multiple={config.multiple}
                disabled={isDisabled}
                onChange={handleChange}
                onBlur={field.onBlur}
                className="sr-only"
            />

            {!hasValue ? (
                <label
                    htmlFor={`file-${field.name}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60",
                        "min-h-[90px] px-4 py-5 text-center text-sm text-muted-foreground",
                        "cursor-pointer transition-colors hover:border-primary/40 hover:bg-muted/20",
                        dragOver && "border-primary/60 bg-primary/5",
                        isDisabled && "pointer-events-none opacity-50",
                    )}
                >
                    <Upload className="size-5 text-muted-foreground/60" />
                    <div className="space-y-0.5">
                        <p>
                            <span className="font-medium text-foreground">Click to upload</span>
                            {" or drag and drop"}
                        </p>
                        {(config.accept || config.maxSizeMb) && (
                            <p className="text-xs">
                                {config.accept?.replace(/,\s*/g, " · ")}
                                {config.accept && config.maxSizeMb && " · "}
                                {config.maxSizeMb && `Max ${config.maxSizeMb}MB`}
                            </p>
                        )}
                    </div>
                </label>
            ) : isMultipleFiles ? (
                <div className="flex flex-col gap-2">
                    {(value as File[]).map((file: File, index: number) => (
                        <FilePreviewItem
                            key={`${file.name}-${index}`}
                            file={file}
                            showPreview={showPreview}
                            isDisabled={isDisabled}
                            onRemove={() => handleRemoveFile(index)}
                        />
                    ))}
                    <label
                        htmlFor={`file-${field.name}`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-2 text-xs text-muted-foreground cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-colors"
                    >
                        <Upload className="size-3.5" />
                        Add more files
                    </label>
                </div>
            ) : (
                <SingleFilePreview
                    value={value as File | string}
                    showPreview={showPreview}
                    isDisabled={isDisabled}
                    onClear={handleClear}
                />
            )}

            {sizeError && (
                <p className="text-xs text-destructive">{sizeError}</p>
            )}
        </div>
    );
}

function FilePreviewItem({ file, showPreview, isDisabled, onRemove }: {
    file: File;
    showPreview: boolean;
    isDisabled: boolean;
    onRemove: () => void;
}) {
    const previewUrl = showPreview && file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="size-12 shrink-0 rounded-md object-cover" />
            ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    <ImageIcon className="size-5 text-muted-foreground" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>
            {!isDisabled && (
                <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                    <X className="size-4" />
                </Button>
            )}
        </div>
    );
}

function SingleFilePreview({ value, showPreview, isDisabled, onClear }: {
    value: File | string;
    showPreview: boolean;
    isDisabled: boolean;
    onClear: () => void;
}) {
    const previewUrl: string | null = (() => {
        if (!showPreview) return null;
        if (typeof value === "string") return value;
        if (value instanceof File && value.type.startsWith("image/")) return URL.createObjectURL(value);
        return null;
    })();

    const fileName = value instanceof File ? value.name : value.split("/").pop() ?? value;

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="size-12 shrink-0 rounded-md object-cover" />
            ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    <ImageIcon className="size-5 text-muted-foreground" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{fileName}</p>
                {value instanceof File && (
                    <p className="text-xs text-muted-foreground">
                        {(value.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                )}
            </div>
            {!isDisabled && (
                <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={onClear}>
                    <X className="size-4" />
                </Button>
            )}
        </div>
    );
}
