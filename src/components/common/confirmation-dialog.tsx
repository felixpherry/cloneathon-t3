import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  actionButtonProps: React.ComponentProps<typeof AlertDialogAction>;
  cancelButtonProps?: React.ComponentProps<typeof AlertDialogCancel>;
}

export default function ConfirmationDialog({
  children,
  title,
  description,
  actionButtonProps,
  cancelButtonProps = { children: 'Cancel' },
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel {...cancelButtonProps} />
          <AlertDialogAction {...actionButtonProps} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
