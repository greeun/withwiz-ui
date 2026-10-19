/**
 * Form 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

// Mock cn
vi.mock('@withwiz/ui/react/utils/client-utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@withwiz/ui/react/primitives/form';

// 테스트용 폼 래퍼 컴포넌트
function TestFormWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm({
    defaultValues: { testField: '' },
  });
  return <Form {...form}>{children}</Form>;
}

function TestFormFieldWrapper({ children }: { children: (field: any) => React.ReactNode }) {
  const form = useForm({
    defaultValues: { testField: '' },
  });
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="testField"
        render={({ field }) => (
          <FormItem>
            {children(field)}
          </FormItem>
        )}
      />
    </Form>
  );
}

describe('Form 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FormItem 렌더링', () => {
    it('FormItem이 올바르게 렌더링된다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <div data-testid="form-child">Content</div>}
        </TestFormFieldWrapper>
      );
      const item = document.querySelector('[data-slot="form-item"]');
      expect(item).toBeDefined();
      expect(item?.className).toContain('grid');
      expect(screen.getByTestId('form-child')).toBeDefined();
    });

    it('FormItem에 className이 적용된다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <div>Test</div>}
        </TestFormFieldWrapper>
      );
      const item = document.querySelector('[data-slot="form-item"]');
      expect(item).toBeDefined();
      expect(item?.getAttribute('data-slot')).toBe('form-item');
      expect(item?.className).toContain('gap-2');
    });

    it('FormItem 내부에 children이 렌더링된다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <span data-testid="inner-text">Inner Text</span>}
        </TestFormFieldWrapper>
      );
      expect(screen.getByTestId('inner-text')).toBeDefined();
      expect(screen.getByTestId('inner-text').textContent).toBe('Inner Text');
      expect(document.querySelector('[data-slot="form-item"]')).toBeDefined();
    });
  });

  describe('FormLabel 렌더링', () => {
    it('FormLabel이 렌더링된다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <FormLabel>Test Label</FormLabel>}
        </TestFormFieldWrapper>
      );
      const label = document.querySelector('[data-slot="form-label"]');
      expect(label).toBeDefined();
      expect(label?.textContent).toBe('Test Label');
      expect(label?.getAttribute('data-error')).toBe('false');
    });

    it('FormLabel에 data-slot이 적용된다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <FormLabel>Label</FormLabel>}
        </TestFormFieldWrapper>
      );
      const label = document.querySelector('[data-slot="form-label"]');
      expect(label).toBeDefined();
      expect(label?.getAttribute('data-slot')).toBe('form-label');
      expect(label?.getAttribute('data-error')).toBe('false');
    });

    it('FormLabel이 htmlFor 속성을 가진다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <FormLabel>Field Label</FormLabel>}
        </TestFormFieldWrapper>
      );
      const label = document.querySelector('[data-slot="form-label"]');
      expect(label).toBeDefined();
      expect(label?.getAttribute('for')).toBeTruthy();
      expect(label?.textContent).toBe('Field Label');
    });
  });

  describe('FormControl 렌더링', () => {
    it('FormControl이 렌더링된다', () => {
      render(
        <TestFormFieldWrapper>
          {(field: any) => (
            <FormControl>
              <input data-testid="test-input" {...field} />
            </FormControl>
          )}
        </TestFormFieldWrapper>
      );
      const input = screen.getByTestId('test-input');
      expect(input).toBeDefined();
      expect(input.getAttribute('aria-invalid')).toBe('false');
      expect(input.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('FormDescription이 렌더링된다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <FormDescription>Help text here</FormDescription>}
        </TestFormFieldWrapper>
      );
      const desc = document.querySelector('[data-slot="form-description"]');
      expect(desc).toBeDefined();
      expect(desc?.textContent).toBe('Help text here');
      expect(desc?.className).toContain('text-sm');
    });

    it('FormMessage는 에러가 없으면 렌더링되지 않는다', () => {
      render(
        <TestFormFieldWrapper>
          {() => <FormMessage />}
        </TestFormFieldWrapper>
      );
      const message = document.querySelector('[data-slot="form-message"]');
      expect(message).toBeNull();
      expect(document.querySelector('[data-slot="form-item"]')).toBeDefined();
      expect(document.querySelectorAll('[data-slot="form-message"]').length).toBe(0);
    });
  });
});
