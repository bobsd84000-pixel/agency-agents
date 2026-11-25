import React, { createRef } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
import Button from './Button';

describe('Button : rendu des variantes', () => {
  it.each(['primary', 'secondary', 'ghost', 'danger'])('rend la variante %s', (variant) => {
    render(<Button variant={variant}>Texte</Button>);
    const btn = screen.getByRole('button', { name: 'Texte' });
    expect(btn).toHaveClass('ui-btn');
    expect(btn.style.border).not.toContain('undefined');
  });

  it('revient à la variante primary si la variante est inconnue (ex. "focus")', () => {
    render(<Button variant="focus">Texte</Button>);
    const btn = screen.getByRole('button', { name: 'Texte' });
    expect(btn.style.backgroundColor).toBe('rgb(29, 78, 216)'); // #1d4ed8
    expect(btn.style.border).not.toContain('undefined');
  });

  it('type vaut "button" par défaut', () => {
    render(<Button>Texte</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});

describe('Button : ref', () => {
  it('transmet ref au élément <button>', () => {
    const ref = createRef();
    render(<Button ref={ref}>Texte</Button>);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current.tagName).toBe('BUTTON');
  });
});

describe('Button : état loading', () => {
  it('affiche aria-busy et bloque le clic', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Enregistrer
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('affiche le spinner pendant le chargement', () => {
    const { container } = render(<Button loading>Enregistrer</Button>);
    expect(container.querySelector('.ui-btn-spinner')).not.toBeNull();
  });

  it('n\'affiche pas le spinner hors chargement', () => {
    const { container } = render(<Button>Enregistrer</Button>);
    expect(container.querySelector('.ui-btn-spinner')).toBeNull();
  });
});

describe('Button : état disabled', () => {
  it('est désactivé natif et bloque le clic', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Annuler
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('déclenche onClick quand il n\'est ni disabled ni loading', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Valider</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
