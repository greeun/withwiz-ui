/**
 * qr-code 유틸리티 단위 테스트
 *
 * Tests for src/react/utils/qr-code.ts
 * - generateQRCodeUrl: shortCode 인코딩
 * - isSafeLogoDataUrl / downloadQRCodeWithLogo: 로고 data URL 검증
 */
import { describe, it, expect } from 'vitest';
import {
  generateQRCodeUrl,
  isSafeLogoDataUrl,
  downloadQRCodeWithLogo,
} from '@withwiz/ui/react/utils/qr-code';

const PNG_DATA_URL = 'data:image/png;base64,iVBORw0KGgo=';

describe('generateQRCodeUrl', () => {
  it('단순한 shortCode 는 그대로 경로에 붙는다', () => {
    expect(generateQRCodeUrl('abc123', 'https://w.iz')).toBe('https://w.iz/abc123?src=qr');
  });

  it('경로·쿼리 구분자가 섞인 shortCode 는 인코딩되어 URL 구조를 바꾸지 못한다', () => {
    expect(generateQRCodeUrl('a/b?x=1#f', 'https://w.iz')).toBe(
      'https://w.iz/a%2Fb%3Fx%3D1%23f?src=qr'
    );
  });

  it('baseUrl 끝의 슬래시는 중복되지 않는다', () => {
    expect(generateQRCodeUrl('abc', 'https://w.iz/')).toBe('https://w.iz/abc?src=qr');
  });
});

describe('isSafeLogoDataUrl', () => {
  it('base64 data:image/* URL 은 허용한다', () => {
    expect(isSafeLogoDataUrl(PNG_DATA_URL)).toBe(true);
    expect(isSafeLogoDataUrl('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')).toBe(true);
  });

  it('외부 URL·스크립트 스킴·비이미지 data URL 은 거부한다', () => {
    expect(isSafeLogoDataUrl('https://evil.example/logo.png')).toBe(false);
    expect(isSafeLogoDataUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeLogoDataUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
    expect(isSafeLogoDataUrl('data:image/png,<svg onload=alert(1)>')).toBe(false);
  });
});

describe('downloadQRCodeWithLogo', () => {
  it('안전하지 않은 logoDataUrl 이면 DOM 을 건드리기 전에 거부한다', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    await expect(
      downloadQRCodeWithLogo(svg, 'https://evil.example/logo.png', { format: 'svg' })
    ).rejects.toThrow(/logoDataUrl/);
  });
});
