import { Head, useForm } from '@inertiajs/react'
import { Button } from '~/components/base/buttons/button'
import { Input } from '~/components/base/input/input'
import AuthLayout from '~/layouts/auth_layout'

export default function LoginScreen() {
  const form = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/login')
  }

  const onFormFieldChange = (value: string, name: keyof typeof form.data) => {
    form.setData(name, value)
  }

  return (
    <>
      <Head title="Log in" />

      <AuthLayout
        heading="Log in to your account"
        subheading="Welcome back! Please enter your details"
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <Input
              isRequired
              label="Email"
              type="email"
              placeholder="Enter your email"
              isInvalid={!!form.errors.email}
              hint={form.errors.email}
              size="md"
              value={form.data.email}
              onChange={(v) => onFormFieldChange(v, 'email')}
            />

            <Input
              isRequired
              label="Password"
              type="password"
              placeholder="Enter you password"
              isInvalid={!!form.errors.password}
              hint={form.errors.password}
              size="md"
              value={form.data.password}
              onChange={(v) => onFormFieldChange(v, 'password')}
            />
          </div>

          <Button size="lg" type="submit" isDisabled={form.processing}>
            {form.processing ? 'Loading' : 'Sign in'}
          </Button>
        </form>
        <div className="flex justify-center gap-1 text-center">
          <span className="text-sm text-tertiary">Don' have an account?</span>
          <Button href="/register" color="link-color">
            Sign up
          </Button>
        </div>
      </AuthLayout>
    </>
  )
}
