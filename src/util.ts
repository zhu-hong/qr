import qrcodegen from './qrcodegen'

export type Level = 'L' | 'M' | 'Q' | 'H'
const levels: Record<Level, qrcodegen.QrCode.Ecc> = {
  L: qrcodegen.QrCode.Ecc.LOW,
  M: qrcodegen.QrCode.Ecc.MEDIUM,
  Q: qrcodegen.QrCode.Ecc.QUARTILE,
  H: qrcodegen.QrCode.Ecc.HIGH,
}

export const encodeText = (content: string, level: Level = 'H'): boolean[][] => qrcodegen.QrCode.encodeText(content, levels[level]).getModules()