import { Head, useForm } from '@inertiajs/react'
import { Button } from '~/components/base/buttons/button'
import { Input } from '~/components/base/input/input'
import AuthLayout from '~/layouts/auth_layout'

export default function RegisterScreen() {
  const form = useForm({
    fullName: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/register')
  }

  const onFormFieldChange = (value: string, name: keyof typeof form.data) => {
    form.setData(name, value)
  }

  return (
    <>
      <Head title="Sign up" />

      <AuthLayout heading="Sign up" subheading="To get started, create an account">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <Input
              isRequired
              label="Fullname"
              placeholder="Enter your fullname"
              isInvalid={!!form.errors.fullName}
              hint={form.errors.fullName}
              size="md"
              value={form.data.fullName}
              onChange={(v) => onFormFieldChange(v, 'fullName')}
            />

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
              hint={form.errors.password ?? 'Must be at least 8 characters'}
              size="md"
              value={form.data.password}
              onChange={(v) => onFormFieldChange(v, 'password')}
            />
          </div>

          <Button size="lg" type="submit" isDisabled={form.processing}>
            {form.processing ? 'Loading' : 'Get started'}
          </Button>
        </form>
        <div className="flex justify-center gap-1 text-center">
          <span className="text-sm text-tertiary">Already have an account?</span>
          <Button href="/login" color="link-color">
            Log in
          </Button>
        </div>
      </AuthLayout>
    </>
  )
}
