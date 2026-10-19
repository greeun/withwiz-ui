/**
 * Card 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@withwiz/ui/react/primitives/card';

describe('Card', () => {
  it('기본 Card가 렌더링된다', () => {
    render(<Card data-testid="card">카드 콘텐츠</Card>);

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-slot', 'card');
    expect(card).toHaveTextContent('카드 콘텐츠');
  });

  it('모든 하위 컴포넌트가 렌더링된다', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">제목</CardTitle>
          <CardDescription data-testid="desc">설명</CardDescription>
          <CardAction data-testid="action">액션</CardAction>
        </CardHeader>
        <CardContent data-testid="content">콘텐츠</CardContent>
        <CardFooter data-testid="footer">푸터</CardFooter>
      </Card>
    );

    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header');
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description');
    expect(screen.getByTestId('action')).toHaveAttribute('data-slot', 'card-action');
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content');
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer');
  });

  it('커스텀 className이 적용된다', () => {
    render(<Card data-testid="card" className="my-custom-class">내용</Card>);

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card.className).toContain('my-custom-class');
    expect(card).toHaveAttribute('data-slot', 'card');
  });
});
