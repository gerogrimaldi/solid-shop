"use client";

type SimpleModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
};

export default function ErrorModal({
  isOpen,
  title,
  message,
  buttonText = "Aceptar",
  onClose,
}: SimpleModalProps) {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-gray-200 bg-opacity-10 backdrop-blur-sm z-50 flex justify-center items-center">
<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-500 transition-colors font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
