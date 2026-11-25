import React, { forwardRef } from 'react';
import './Button.css';

/* Tokens de couleur : une seule source pour toute la palette.
   Le focus et le survol ne sont PAS ici : ce sont des états gérés dans Button.css. */
const TOKENS = {
  primary: { bg: '#1d4ed8', fg: '#ffffff', border: '#1d4ed8' }, // blanc sur bleu : ~6,7:1
  secondary: { bg: '#f3f4f6', fg: '#111827', border: '#6b7280' }, // bord : ~4,8:1 sur blanc (>= 3:1)
  ghost: { bg: 'transparent', fg: '#1d4ed8', border: 'transparent' },
  danger: { bg: '#b91c1c', fg: '#ffffff', border: '#b91c1c' }, // blanc sur rouge : ~6,5:1
};

const SIZES = {
  sm: { padding: '6px 10px', fontSize: 14, minHeight: 32 },
  md: { padding: '8px 14px', fontSize: 16, minHeight: 40 },
  lg: { padding: '12px 20px', fontSize: 18, minHeight: 48 },
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    onClick,
    children,
    className = '',
    style,
    ...rest // autres props HTML (aria-*, id, name, onFocus...) transmises au <button>
  },
  ref
) {
  const isBlocked = disabled || loading;

  // Variante inconnue (ex. "focus") : repli sur "primary"
  const variantKey = Object.prototype.hasOwnProperty.call(TOKENS, variant) ? variant : 'primary';
  const colors = TOKENS[variantKey];
  const sizing = SIZES[size] ?? SIZES.md;

  // Garde-fou : aucun onClick tant que le bouton est bloqué
  const handleClick = (event) => {
    if (isBlocked) {
      event.preventDefault(); // empêche aussi la soumission d'un formulaire
      return;
    }
    onClick?.(event);
  };

  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: fullWidth ? '100%' : undefined,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontFamily: 'inherit',
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: loading ? 'progress' : disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'filter 0.15s',
    ...sizing,
    ...style,
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={`ui-btn ${className}`.trim()}
      style={styles}
      onClick={handleClick}
      disabled={disabled}                       // disabled natif : pas de clic, pas de focus
      aria-disabled={isBlocked || undefined}    // bloqué aussi pendant le chargement
      aria-busy={loading || undefined}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="ui-btn-spinner"
        />
      )}
      {children}
    </button>
  );
});

export default Button;
