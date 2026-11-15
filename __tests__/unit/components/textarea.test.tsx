// @vitest-environment jsdom
/**
 * components/ui/Textarea 유닛테스트
 *
 * 테스트 범위:
 * - 기본 textarea 요소로 렌더된다 (폼 전송·E2E 가 태그로 찾는다)
 * - name·rows·required 등 전달한 속성이 그대로 붙는다
 * - 소비자 className 이 cn() 으로 병합되어 충돌하는 기본 클래스를 밀어낸다
 */
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Textarea } from '@withwiz/ui/react/components/ui/Textarea';

afterEach(cleanup);

describe('components/ui/Textarea', () => {
  it('기본 textarea 요소로 렌더된다', () => {
    render(<Textarea aria-label="본문" />);
    const el = screen.getByRole('textbox', { name: '본문' });
    expect(el.tagName).toBe('TEXTAREA');
    expect(el.className).toContain('border-input');
    expect(el.className).toContain('min-h-20');
  });

  it('전달한 속성이 그대로 붙는다', () => {
    render(
      <Textarea name="body" rows={6} required maxLength={500} placeholder="내용" defaultValue="초기값" />
    );
    const el = screen.getByPlaceholderText('내용') as HTMLTextAreaElement;
    expect(el).toHaveAttribute('name', 'body');
    expect(el).toHaveAttribute('rows', '6');
    expect(el).toBeRequired();
    expect(el).toHaveAttribute('maxlength', '500');
    expect(el.value).toBe('초기값');
  });

  it('className 을 병합하고 충돌하는 기본 클래스를 덮어쓴다', () => {
    render(<Textarea aria-label="메모" className="min-h-40 font-mono" />);
    const el = screen.getByRole('textbox', { name: '메모' });
    expect(el.className).toContain('min-h-40');
    expect(el.className).toContain('font-mono');
    expect(el.className).not.toContain('min-h-20');
    expect(el.className).toContain('bg-background');
  });
});
