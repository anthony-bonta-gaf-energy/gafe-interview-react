interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  options?: { value: string; label: string }[];
}

const Input = ({ label, type, options, ...props }: InputProps) => {
  const labelText = props.required ? `${label} *` : label;

  if (type === 'select') {
    return (
      <>
        <label htmlFor={props.name}>{labelText}</label>
        <select {...props}>
          {options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </>
    )
  }
  return (
    <>
      <label htmlFor={props.name}>{labelText}</label>
      <input {...props} type={type} id={props.name} />
    </>
  )
}

export default Input