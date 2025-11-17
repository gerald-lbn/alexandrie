import { useForm } from '@inertiajs/react'

export default function LoginScreen() {
  const form = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/login')
  }

  const onFormFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof typeof form.data
  ) => {
    form.setData(name, e.target.value)
  }

  return (
    <div>
      <h1>Login</h1>

      <pre>
        <code>{JSON.stringify(form, null, 2)}</code>
      </pre>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input required type="email" id="email" onChange={(e) => onFormFieldChange(e, 'email')} />
          {form.errors.email && <p>{form.errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            id="password"
            onChange={(e) => onFormFieldChange(e, 'password')}
          />
          {form.errors.password && <p>{form.errors.password}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}
