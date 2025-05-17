
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-store-pink to-store-pink/80 text-primary-foreground hover:shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        outline:
          "border border-input bg-background/70 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-store-light-pink to-store-light-pink/80 text-gray-800 hover:shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-gradient-to-r from-store-yellow to-store-yellow/80 text-black hover:shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
      },
      size: {
        default: "h-10 px-5 py-3",
        sm: "h-9 rounded-md px-4 py-2",
        lg: "h-12 rounded-md px-8 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
