import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import SubmitForm from './submit-form'

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <SubmitForm t={dict.submit} lang={lang} />
}
