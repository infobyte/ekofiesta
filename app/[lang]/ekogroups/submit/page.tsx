import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../dictionaries'
import ActivityForm from './activity-form'

export default async function EkogroupSubmitPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <ActivityForm t={dict.ekogroupsSubmit} types={dict.ekogroups.types} lang={lang} />
}
