import { ModalProps } from "./modal.types";
import { modalStyles } from "./modal.styles";

export const Modal = ({ 
    
    isOpen,
    title, 
    children,
     onClose
 }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>{title}</div>

        {children}
        </div>
    </div>
  );
}