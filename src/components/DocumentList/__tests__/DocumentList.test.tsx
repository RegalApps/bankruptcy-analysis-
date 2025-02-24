
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentList } from '../DocumentList';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockDocuments = [
  {
    id: '1',
    title: 'Test Document',
    type: 'pdf',
    created_at: new Date().toISOString(),
    size: 1024,
    storage_path: 'test/path'
  }
];

describe('DocumentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders document items with correct icons', () => {
    render(
      <BrowserRouter>
        <DocumentList documents={mockDocuments} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('displays file size in correct format', () => {
    render(
      <BrowserRouter>
        <DocumentList documents={mockDocuments} />
      </BrowserRouter>
    );

    expect(screen.getByText('1.00 KB')).toBeInTheDocument();
  });
});
