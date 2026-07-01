"use client";

// Réexport pratique de l'API react-hot-toast pour un usage cohérent.
// Le <Toaster /> est monté globalement via components/providers/ToastProvider.
import toast from "react-hot-toast";

export { toast };
export default toast;
