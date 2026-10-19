/**
 * Tabs 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@withwiz/ui/react/primitives/tabs';

describe('Tabs', () => {
  it('기본 Tabs가 렌더링된다', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">탭1</TabsTrigger>
          <TabsTrigger value="tab2">탭2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">콘텐츠1</TabsContent>
        <TabsContent value="tab2">콘텐츠2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('탭1')).toBeInTheDocument();
    expect(screen.getByText('탭2')).toBeInTheDocument();
    expect(screen.getByText('콘텐츠1')).toBeInTheDocument();
  });

  it('탭 클릭으로 콘텐츠가 변경된다', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">탭1</TabsTrigger>
          <TabsTrigger value="tab2">탭2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">콘텐츠1</TabsContent>
        <TabsContent value="tab2">콘텐츠2</TabsContent>
      </Tabs>
    );

    await userEvent.click(screen.getByText('탭2'));

    expect(screen.getByText('콘텐츠2')).toBeInTheDocument();
    expect(screen.getByText('탭1')).toBeInTheDocument();
    expect(screen.getByText('탭2')).toBeInTheDocument();
  });

  it('data-slot 속성이 올바르게 설정된다', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">탭1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">내용</TabsContent>
      </Tabs>
    );

    expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-content"]')).toBeInTheDocument();
  });
});
