import { profile } from '../data/resume'

export type CvVariant = 'photo' | 'classic' | 'simple'

export interface CvOption {
  id: CvVariant
  label: string
  description: string
  file: string
}

export const cvOptions: CvOption[] = [
  {
    id: 'photo',
    label: 'Photo sidebar CV',
    description: 'Two-column layout with your picture',
    file: 'Muhammad-Suhaib-CV-Photo.pdf',
  },
  {
    id: 'classic',
    label: 'Classic ATS CV',
    description: 'Single column, recruiter and ATS friendly',
    file: 'Muhammad-Suhaib-CV-Classic.pdf',
  },
  {
    id: 'simple',
    label: 'Simple one-column CV',
    description: 'Plain, compact, black and white',
    file: 'Muhammad-Suhaib-CV-Simple.pdf',
  },
]

async function loadPhoto(): Promise<string | undefined> {
  try {
    const res = await fetch(profile.photo, { cache: 'no-cache' })
    if (!res.ok || !(res.headers.get('content-type') ?? '').startsWith('image/')) return undefined
    const bitmap = await createImageBitmap(await res.blob())
    const size = Math.min(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = Math.min(size, 500)
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    ctx.drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.92)
  } catch {
    return undefined
  }
}

export async function downloadCv(variant: CvVariant) {
  const option = cvOptions.find((o) => o.id === variant)!
  const [{ pdf }, { ClassicCv }, { SimpleCv }, { PhotoCv }, photo] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./ClassicCv'),
    import('./SimpleCv'),
    import('./PhotoCv'),
    variant === 'photo' ? loadPhoto() : Promise.resolve(undefined),
  ])

  const doc =
    variant === 'photo' ? <PhotoCv photo={photo} /> : variant === 'classic' ? <ClassicCv /> : <SimpleCv />

  const blob = await pdf(doc).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = option.file
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
