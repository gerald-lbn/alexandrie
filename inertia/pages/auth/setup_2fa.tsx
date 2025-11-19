import Setup2FAController from '#authentication/controllers/setup_2fa_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '~/components/base/buttons/button'
import { Input } from '~/components/base/input/input'
import { PinInput } from '~/components/base/pin_input/pin_input'
import { GradientScan } from '~/components/shared-assets/qr-code'
import AuthLayout from '~/layouts/auth_layout'

export default function Setup2FAScreen({
  qrCode,
  encodedTotp,
}: InferPageProps<Setup2FAController, 'render'>) {
  const form = useForm({
    code: '',
    encodedTotp: encodedTotp,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/2fa/verify')
  }

  const onFormFieldChange = (value: string, name: keyof typeof form.data) => {
    form.setData(name, value)
  }

  return (
    <>
      <Head title="Two Factor Authentication" />

      <AuthLayout
        heading="2FA Setup"
        subheading="To increase security, please setup the two factor authentication"
      >
        <div className="-my-24 relative flex w-full items-center justify-center aspect-square place-self-center">
          <div
            dangerouslySetInnerHTML={{ __html: qrCode }}
            style={{ width: 196, height: 196, padding: 0 }}
          ></div>
          <GradientScan />
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input name="encodedTotp" value={encodedTotp} hidden isRequired />
          <div>
            <PinInput size="sm">
              <PinInput.Label>Enter code from your 2FA application</PinInput.Label>
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
            {form.processing ? 'Verifying' : 'Verify'}
          </Button>
        </form>
      </AuthLayout>
    </>
  )
}
