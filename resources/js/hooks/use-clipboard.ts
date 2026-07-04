// Credit: https://usehooks-ts.com/
import { useCallback, useState } from 'react';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useClipboard(): [CopiedValue, CopyFn] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = useCallback(async (text) => {
        try {
            if (navigator?.clipboard) {
                await navigator.clipboard.writeText(text);
            } else if (!legacyCopy(text)) {
                return false;
            }
            setCopiedText(text);

            return true;
        } catch {
            // clipboard api can fail outside secure contexts (plain http)
            if (legacyCopy(text)) {
                setCopiedText(text);

                return true;
            }
            setCopiedText(null);

            return false;
        }
    }, []);

    return [copiedText, copy];
}

// hidden textarea + execCommand fallback for browsers without clipboard api
function legacyCopy(text: string): boolean {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);

        return ok;
    } catch {
        return false;
    }
}
