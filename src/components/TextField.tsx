interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  textarea?: boolean
}

export function TextField({ label, value, onChange, required, placeholder, textarea }: TextFieldProps) {
  return (
    <div className="form-field">
      <label>
        {label}
        {required ? ' *' : ''}
      </label>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}
