/*
    File: use-punkbuster.tsx
    Author: Santiago Bugnón (santikzz)
    Date: July 4, 2025
    Description: 
            A hook to implement basic anti-debugging and anti-tampering measures,
            by disabling common developer tools, preventing text selection, and clearing the console.

    Usage example:
    
        usePunkbuster();

    Intelectual Property of Nebula Solutions.
*/

import { useEffect, useRef } from "react";

interface KeyCombo {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
}

const keyCombosBlacklist: KeyCombo[] = [
    { key: 'F12' },                                 // F12
    { key: 'I', ctrl: true, shift: true },          // ctrl+shift+i (inspector)
    { key: 'J', ctrl: true, shift: true },          // ctrl+shift+j (console)
    { key: 'U', ctrl: true },                       // ctrl+u (view source)
    { key: 'C', ctrl: true, shift: true },          // ctrl+shift+c (inspect element)
    { key: 'A', ctrl: true },                       // ctrl+a (select all)
    { key: 'S', ctrl: true },                       // ctrl+s (save)
    { key: 'P', ctrl: true },                       // ctrl+p (print)
    { key: 'PrintScreen' },                         // Print Screen
];

// disable common hotkeys
const disableDevToolsKeys = (e: KeyboardEvent) => {
    const isBlacklisted = keyCombosBlacklist.some(combo => {
        const keyMatch = combo.key.toLowerCase() === e.key.toLowerCase();
        const ctrlMatch = combo.ctrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = combo.alt ? e.altKey : !e.altKey;
        return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (isBlacklisted) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
};

// disable right click and middle click
const disableMouseActions = (e: MouseEvent) => {
    if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

// disable text selection
const disableTextSelection = () => {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
};

const restoreTextSelection = () => {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';
}

// disable drag and drop
const disableDragDrop = (e: DragEvent) => {
    e.preventDefault();
    return false;
}

// clear console periodically
const clearConsole = () => {
    try {
        console.clear();
        console.log('%cAccess Denied', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cUnauthorized access to developer tools is prohibited.', 'color: red; font-size: 16px;');
    } catch (e) { }
};

// check if developer tools are open
const checkDevTools = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) {
        document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-family: Arial, sans-serif; font-size: 24px;">Developer tools detected. Please close them to continue.</div>';
        return true;
    } else {
        return false;
    }
}

// disable print screen key
const disablePrintScreen = (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen' || e.key === 'PrtScn') {
        e.preventDefault();
        return false;
    }
}

// disable printer
const disablePrinter = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
    }
}

/*
    Hook to initialize Punkbuster protection
*/

export const usePunkbuster = () => {

    // idk why dokploy doesnt read env vars
    // const enabled = import.meta.env.VITE_ENABLE_PUNKBUSTER === 'true' || true;

    const debuggerCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const consoleCheckInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        // if(!enabled) return;

        // init protection
        document.addEventListener('contextmenu', disableMouseActions);
        document.addEventListener('mousedown', disableMouseActions);
        document.addEventListener('mouseup', disableMouseActions);
        document.addEventListener('click', disableMouseActions);
        document.addEventListener('auxclick', disableMouseActions);
        document.addEventListener('keydown', disableDevToolsKeys);
        document.addEventListener('keydown', disablePrintScreen);
        document.addEventListener('keydown', disablePrinter);
        document.addEventListener('dragstart', disableDragDrop);
        document.addEventListener('drop', disableDragDrop);

        disableTextSelection();

        // setup check intervals
        debuggerCheckInterval.current = setInterval(checkDevTools, 1000);
        consoleCheckInterval.current = setInterval(clearConsole, 1000);
    

        // cleanup on unmount (restore)
        return () => {
            document.removeEventListener('contextmenu', disableMouseActions);
            document.removeEventListener('mousedown', disableMouseActions);
            document.removeEventListener('mouseup', disableMouseActions);
            document.removeEventListener('click', disableMouseActions);
            document.removeEventListener('auxclick', disableMouseActions);
            document.removeEventListener('keydown', disableDevToolsKeys);
            document.removeEventListener('keydown', disablePrintScreen);
            document.removeEventListener('keydown', disablePrinter);
            document.removeEventListener('dragstart', disableDragDrop);
            document.removeEventListener('drop', disableDragDrop);

            if (debuggerCheckInterval.current) {
                clearInterval(debuggerCheckInterval.current);
            }

            if (consoleCheckInterval.current) {
                clearInterval(consoleCheckInterval.current);
            }

            restoreTextSelection();
        }

    }, []);

};