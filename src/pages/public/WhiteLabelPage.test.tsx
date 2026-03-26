import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WhiteLabelPage from './WhiteLabelPage';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');
vi.mock('@/components/chatbot/ChatWidget', () => ({
  ChatWidget: () => <div data-testid="chat-widget">Chat Widget</div>,
}));

const mockIntegratorData = {
  id: '1',
  slug: 'test-company',
  company_name: 'Test Company',
  active: true,
  primary_color: '#E88A1A',
  secondary_color: '#2D9B83',
  accent_color: '#F5C542',
  logo_url: '',
  hero_title: 'Test Hero',
  hero_subtitle: 'Test Subtitle',
  cta_text: 'Test CTA',
  footer_text: 'Test Footer',
  phone: '',
  email: '',
  bot_name: 'Test Bot',
  welcome_message: 'Welcome',
  closing_message: 'Closing',
  features: [],
  testimonials: [],
};

const renderWithRouter = (initialRoute = '/s/test-company') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/s/:slug" element={<WhiteLabelPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('WhiteLabelPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading spinner while fetching data', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn(() =>
      new Promise(() => {
        // Never resolves to keep loading state
      })
    );

    vi.mocked(supabase).from.mockReturnValue({
      select: mockSelect,
    } as any);
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });

    renderWithRouter();

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders not_found error when slug does not exist', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    vi.mocked(supabase).from.mockReturnValue({
      select: mockSelect,
    } as any);
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
      expect(
        screen.getByText(/o site que você está procurando não existe/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Voltar ao início')).toBeInTheDocument();
    });
  });

  it('renders inactive error when integrator is inactive', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: { ...mockIntegratorData, active: false },
      error: null,
    });

    vi.mocked(supabase).from.mockReturnValue({
      select: mockSelect,
    } as any);
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Site temporariamente indisponível')).toBeInTheDocument();
      expect(
        screen.getByText(/entre em contato com o integrador/i)
      ).toBeInTheDocument();
    });
  });

  it('renders network_error when query fails', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: new Error('Network error'),
    });

    vi.mocked(supabase).from.mockReturnValue({
      select: mockSelect,
    } as any);
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar a página')).toBeInTheDocument();
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });
  });

  it('renders integrator page when data is found and active', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: mockIntegratorData,
      error: null,
    });

    vi.mocked(supabase).from.mockImplementation((table: string) => {
      if (table === 'integrators') {
        return {
          select: mockSelect,
        } as any;
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getAllByTestId('chat-widget').length).toBeGreaterThan(0);
      expect(screen.getByText('Test Hero')).toBeInTheDocument();
    });
  });

  it('does not render integrator content when active is false', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: { ...mockIntegratorData, active: false },
      error: null,
    });

    vi.mocked(supabase).from.mockReturnValue({
      select: mockSelect,
    } as any);
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryByText('Test Company')).not.toBeInTheDocument();
      expect(screen.queryByTestId('chat-widget')).not.toBeInTheDocument();
    });
  });
});
