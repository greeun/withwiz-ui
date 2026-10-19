# Primitives (`@withwiz/ui/react/primitives`)

shadcn/ui-style primitives built on Radix UI. Each file is imported on its own:

```tsx
import { Button } from '@withwiz/ui/react/primitives/button';
import { Dialog, DialogContent, DialogTitle } from '@withwiz/ui/react/primitives/dialog';
```

## Modules

| File | Exports | Built on |
|------|---------|----------|
| `accordion` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | `radix-ui` |
| `alert` | `Alert`, `AlertTitle`, `AlertDescription` | – |
| `alert-dialog` | `AlertDialog` family | `@radix-ui/react-alert-dialog` |
| `badge` | `Badge`, `badgeVariants` | `class-variance-authority` |
| `button` | `Button`, `buttonVariants` (`asChild` supported) | `@radix-ui/react-slot` |
| `card` | `Card`, `CardHeader`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`, `CardFooter` | – |
| `checkbox` | `Checkbox` | `@radix-ui/react-checkbox` |
| `dialog` | `Dialog` family | `@radix-ui/react-dialog` |
| `dropdown-menu` | `DropdownMenu` family | `@radix-ui/react-dropdown-menu` |
| `form` | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField` | `react-hook-form` |
| `input`, `textarea`, `label` | `Input`, `Textarea`, `Label` | `@radix-ui/react-label`(label only) |
| `progress` | `Progress` | `@radix-ui/react-progress` |
| `radio-group` | `RadioGroup`, `RadioGroupItem` | `@radix-ui/react-radio-group` |
| `scroll-area` | `ScrollArea`, `ScrollBar` | `@radix-ui/react-scroll-area` |
| `select` | `Select` family | `@radix-ui/react-select` |
| `separator` | `Separator` | `@radix-ui/react-separator` |
| `sheet` | `Sheet` family | `@radix-ui/react-dialog` |
| `skeleton` | `Skeleton` | – |
| `sonner` | `Toaster` | `sonner`, `next-themes` |
| `switch` | `Switch` | `@radix-ui/react-switch` |
| `table` | `Table` family | – |
| `tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@radix-ui/react-tabs` |
| `theme-provider` | `ThemeProvider` | `next-themes` |
| `tooltip` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | `@radix-ui/react-tooltip` |
| `use-toast` | `useToast` | `sonner` |

## Relation to `react/components/ui`

`react/components/ui/*` (`Button`, `Badge`, `Input`, `Label`, `Select`, `Skeleton`, `Tooltip`, `Alert`)
are lightweight components without Radix. The primitives here share the same variant and size names
and add Radix behavior, `asChild`, `forwardRef`, and the `*Variants` helpers. Both stay available;
pick one per project and keep it consistent.

## Styling

Same as the rest of the package: Tailwind utility classes with shadcn design tokens, merged with `cn()`.
No CSS is shipped — the consumer provides the Tailwind + shadcn theme and must scan
`node_modules/@withwiz/ui/dist` as a Tailwind source.

> Korean: [README.ko.md](./README.ko.md)
