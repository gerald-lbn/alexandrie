import { Head, useForm } from '@inertiajs/react'
import { Button } from '~/components/base/buttons/button'
import { PinInput } from '~/components/base/pin_input/pin_input'
import AuthLayout from '~/layouts/auth_layout'

export default function RegisterScreen() {
  const form = useForm({
    code: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/verify-account')
  }

  const onFormFieldChange = (value: string, name: keyof typeof form.data) => {
    form.setData(name, value)
  }

  return (
    <>
      <Head title="Account verification" />

      <AuthLayout
        heading="Check your email"
        subheading="We sent a verification link to your email address"
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <PinInput>
              <PinInput.Label>Secure code</PinInput.Label>
              <PinInput.Group
                maxLength={6}
                value={form.data.code}
                onChange={(v) => onFormFieldChange(v, 'code')}
              >
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
                <PinInput.Slot index={4} />
                <PinInput.Slot index={5} />
              </PinInput.Group>
              {form.errors.code && <PinInput.Description>{form.errors.code}</PinInput.Description>}
            </PinInput>
          </div>

          <Button size="lg" type="submit" isDisabled={form.processing}>
            {form.processing ? 'Verifying' : 'Verify my account'}
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
