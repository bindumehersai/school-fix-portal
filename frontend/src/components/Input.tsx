import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, icon, className = '', ...rest }, ref) => (
  <div>
    {label && <label className="label">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input ref={ref} className={`input ${icon ? 'pl-10' : ''} ${error ? 'border-error-400 focus:ring-error-100' : ''} ${className}`} {...rest} />
    </div>
    {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, { label?: string; error?: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ label, error, children, className = '', ...rest }, ref) => (
    <div>
      {label && <label className="label">{label}</label>}
      <select ref={ref} className={`input ${error ? 'border-error-400' : ''} ${className}`} {...rest}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, { label?: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, className = '', ...rest }, ref) => (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea ref={ref} className={`input ${error ? 'border-error-400' : ''} ${className}`} {...rest} />
      {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';
