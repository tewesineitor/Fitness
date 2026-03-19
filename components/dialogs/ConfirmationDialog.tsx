import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { vibrate } from '../../utils/helpers';

const ConfirmationDialog: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}> = ({ title, message, onConfirm, onCancel, confirmText = 'Eliminar', cancelText = 'Cancelar' }) => {
    return (
        <Modal onClose={onCancel}>
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                <p className="text-text-secondary my-4">{message}</p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => { vibrate(5); onCancel(); }} className="w-full">{cancelText}</Button>
                    <Button variant="destructive" onClick={() => { vibrate(10); onConfirm(); }} className="w-full shadow-lg shadow-red-500/10">{confirmText}</Button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmationDialog;