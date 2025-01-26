import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmableActionButtonProps {
  label: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "outline" | "ghost" | "default";
}

const ConfirmableActionButton: React.FC<ConfirmableActionButtonProps> = ({
  label,
  description,
  onConfirm,
  isLoading = false,
  variant = "outline",
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="sm" variant={variant} disabled={isLoading}>
        {label}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Processing..." : "Confirm"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmableActionButton;
