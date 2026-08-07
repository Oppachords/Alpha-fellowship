import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantProps } from "@/components/ui/button";

type ButtonLinkProps = ButtonVariantProps &
  React.ComponentProps<typeof Link> & {
    className?: string;
  };

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
