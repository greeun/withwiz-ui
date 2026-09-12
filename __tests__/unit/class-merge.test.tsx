// @vitest-environment jsdom
/**
 * className 병합 회귀 테스트
 *
 * 테스트 범위:
 * - DomainDisplay: 소비자가 넘긴 className 이 cn()(tailwind-merge) 을 거쳐
 *   충돌하는 기본 클래스(text-sm)를 밀어내는지 확인. 템플릿 리터럴 병합으로
 *   회귀하면 이 테스트가 잡는다.
 */
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DomainDisplay } from '../../src/react/components/ui/DomainDisplay';

afterEach(cleanup);

describe('className merging', () => {
  it('DomainDisplay lets a consumer size override the default', () => {
    const { container } = render(<DomainDisplay baseUrl="https://example.com" className="text-lg" />);
    const span = container.querySelector('span')!;
    expect(span.className).toContain('text-lg');
    // tailwind-merge must strip the conflicting default
    expect(span.className).not.toContain('text-sm');
  });

  it('DomainDisplay keeps non-conflicting defaults', () => {
    const { container } = render(<DomainDisplay baseUrl="https://example.com" className="text-lg" />);
    expect(container.querySelector('span')!.className).toContain('font-mono');
  });
});
