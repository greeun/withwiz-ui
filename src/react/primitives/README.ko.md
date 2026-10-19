# 프리미티브 (`@withwiz/ui/react/primitives`)

Radix UI 기반의 shadcn/ui 형식 프리미티브입니다. 파일 단위로 import 합니다.

```tsx
import { Button } from '@withwiz/ui/react/primitives/button';
import { Dialog, DialogContent, DialogTitle } from '@withwiz/ui/react/primitives/dialog';
```

## 모듈

| 파일 | 내보내기 | 기반 |
|------|---------|------|
| `accordion` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | `radix-ui` |
| `alert` | `Alert`, `AlertTitle`, `AlertDescription` | – |
| `alert-dialog` | `AlertDialog` 계열 | `@radix-ui/react-alert-dialog` |
| `badge` | `Badge`, `badgeVariants` | `class-variance-authority` |
| `button` | `Button`, `buttonVariants`(`asChild` 지원) | `@radix-ui/react-slot` |
| `card` | `Card`, `CardHeader`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`, `CardFooter` | – |
| `checkbox` | `Checkbox` | `@radix-ui/react-checkbox` |
| `dialog` | `Dialog` 계열 | `@radix-ui/react-dialog` |
| `dropdown-menu` | `DropdownMenu` 계열 | `@radix-ui/react-dropdown-menu` |
| `form` | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField` | `react-hook-form` |
| `input`, `textarea`, `label` | `Input`, `Textarea`, `Label` | `@radix-ui/react-label`(label 만) |
| `progress` | `Progress` | `@radix-ui/react-progress` |
| `radio-group` | `RadioGroup`, `RadioGroupItem` | `@radix-ui/react-radio-group` |
| `scroll-area` | `ScrollArea`, `ScrollBar` | `@radix-ui/react-scroll-area` |
| `select` | `Select` 계열 | `@radix-ui/react-select` |
| `separator` | `Separator` | `@radix-ui/react-separator` |
| `sheet` | `Sheet` 계열 | `@radix-ui/react-dialog` |
| `skeleton` | `Skeleton` | – |
| `sonner` | `Toaster` | `sonner`, `next-themes` |
| `switch` | `Switch` | `@radix-ui/react-switch` |
| `table` | `Table` 계열 | – |
| `tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@radix-ui/react-tabs` |
| `theme-provider` | `ThemeProvider` | `next-themes` |
| `tooltip` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | `@radix-ui/react-tooltip` |
| `use-toast` | `useToast` | `sonner` |

## `react/components/ui` 와의 관계

`react/components/ui/*`(`Button`, `Badge`, `Input`, `Label`, `Select`, `Skeleton`, `Tooltip`, `Alert`)는
Radix 없이 만든 가벼운 컴포넌트입니다. 이 프리미티브는 variant·size 이름이 같고, Radix 동작과
`asChild`·`forwardRef`·`*Variants` 헬퍼를 더 제공합니다. 두 계열 모두 유지하며, 프로젝트마다
한쪽을 골라 일관되게 씁니다.

## 스타일

패키지의 다른 모듈과 같습니다. Tailwind 유틸리티 클래스와 shadcn 디자인 토큰을 쓰고 `cn()` 으로
병합합니다. CSS 는 배포하지 않으므로 소비자가 Tailwind + shadcn 테마를 제공하고,
`node_modules/@withwiz/ui/dist` 를 Tailwind 소스로 스캔해야 합니다.
