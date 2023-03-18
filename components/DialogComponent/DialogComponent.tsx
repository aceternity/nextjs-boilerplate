import React from 'react';
import { DialogPortal, DialogTrigger, DialogContent, DialogOverlay, Dialog } from '@components/Dialog';
import { Button } from '@components/elements';
interface DialogComponentProps {
  children: JSX.Element | JSX.Element[];
  onPointerDownOutside?: boolean;
  buttonText?: string | null;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogComponent: React.FC<DialogComponentProps> = (props: DialogComponentProps) => {
  const { children, onPointerDownOutside, buttonText, onOpenChange, open } = props;
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
        {buttonText && (
          <DialogTrigger>
            <Button size="md">{buttonText}</Button>
          </DialogTrigger>
        )}
        <DialogOverlay />
      <DialogPortal>

      <DialogContent 
        onPointerDownOutside={(e) => { !onPointerDownOutside ? e.preventDefault(): null }}
      >
        {children}
      </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

DialogComponent.defaultProps = {
  onPointerDownOutside: false,
  buttonText: 'Add New Record'
};

DialogComponent.propTypes = {

};

export default DialogComponent;
