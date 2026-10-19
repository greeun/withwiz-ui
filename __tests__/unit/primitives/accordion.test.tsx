/**
 * Accordion 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@withwiz/ui/react/primitives/accordion';

describe('Accordion', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('질문 1')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion-item"]')).toBeInTheDocument();
  });

  it('트리거 클릭으로 콘텐츠가 표시된다', async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText('질문 1');
    await userEvent.click(trigger);

    expect(screen.getByText('답변 1')).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(trigger.closest('[data-slot="accordion-trigger"]')).toBeInTheDocument();
  });

  it('여러 아이템이 렌더링된다', () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>질문 2</AccordionTrigger>
          <AccordionContent>답변 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('질문 1')).toBeInTheDocument();
    expect(screen.getByText('질문 2')).toBeInTheDocument();
    const items = container.querySelectorAll('[data-slot="accordion-item"]');
    expect(items.length).toBe(2);
  });
});
