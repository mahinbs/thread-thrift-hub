import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-[1.02] shadow-card",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-hover",
        outline:
          "border border-primary/30 bg-background/50 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm",
        secondary:
          "bg-gradient-secondary text-secondary-foreground hover:shadow-glow hover:scale-[1.02] shadow-soft",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground hover:backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        neon: "bg-gradient-neon text-white shadow-neon hover:shadow-glow hover:scale-105 border border-primary/20",
        glass: "glass-morphism text-primary hover:bg-primary/10 hover:scale-[1.02]",
        floating: "bg-gradient-primary text-primary-foreground hover-float shadow-neural",
        glow: "bg-primary text-primary-foreground hover:shadow-neon hover:scale-105 animate-neon-pulse",
        eco: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-[1.02] shadow-card",
        earth: "bg-gradient-secondary text-secondary-foreground hover:shadow-card hover:scale-[1.02] border border-border/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
