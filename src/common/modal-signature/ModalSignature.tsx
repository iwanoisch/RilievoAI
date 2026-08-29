import {Modal} from "../modal/Modal.tsx";
import {useTranslation} from "react-i18next";
import SignaturePad from "../signature-pad/SignaturePad.tsx";


interface ModalSignatureProps{
    isOpen: boolean;
    onClose: () => void;
    onChange: (img : string) => void;
}
export const ModalSignature =({isOpen, onClose, onChange} : ModalSignatureProps) => {
    const {t} = useTranslation();
    return (<Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('modal_sign.title')}
        size="md"
        position="top">
        <SignaturePad
            onChange={onChange}
            onConfirm={onClose}
        />
    </Modal>);
}