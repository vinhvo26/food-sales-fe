import moment from 'moment'

export const EMAIL_REGEX = /^\S+@\S+\.\S+$/

export const conventDate = date => {
  if (!date) {
    return null
  }
  return moment(new Date(date)).format('DD/MM/YYYY HH:mm')
}

export const LAND = [
  {
    id: '1',
    name: 'Đất KCN/CCN/Khu chế xuất',
  },
  {
    id: '2',
    name: 'Đất nuôi trồng thuỷ sản',
  },
  {
    id: '3',
    name: 'Đất xây dựng trường học',
  },
  {
    id: '4',
    name: 'Đất xây dựng cơ sở y tế',
  },
  {
    id: '5',
    name: 'Đất xây kho/xưởng/bãi',
  },
  {
    id: '6',
    name: 'Đất xây dựng trang trại/nông trại công nghệ cao',
  },
  {
    id: '7',
    name: 'Đất xây nhà hàng/khách sạn/khu du lịch',
  },
  {
    id: '8',
    name: 'Đất Khu đô thị/Khu dân cư/Chung cư',
  },
  {
    id: '9',
    name: 'Đất sử dụng khai thác khoáng sản',
  },
  {
    id: '10',
    name: 'Đất phi nông nghiệp khác',
  },
]

export const PROJECT_ASSETS = [
  {
    id: '1',
    name: 'Nhà máy sản xuất',
  },
  {
    id: '2',
    name: 'Kho/nhà xưởng/bãi',
  },
  {
    id: '3',
    name: 'Nhà hàng/khách sạn',
  },
  {
    id: '4',
    name: 'Khu du lich - nghỉ dưỡng',
  },
  {
    id: '5',
    name: 'Bệnh viện - Phòng khám',
  },
  {
    id: '6',
    name: 'Trang trại/nông trại công nghệ cao',
  },
  {
    id: '7',
    name: 'Showroom/cửa hàng',
  },
  {
    id: '8',
    name: 'Chung cư',
  },
  {
    id: '9',
    name: 'Trường học',
  },
  {
    id: '10',
    name: 'Mỏ khai thác khoáng sản',
  },
]

export const ENTERPRICE = [
  {
    id: '1',
    name: 'Bất động sản',
  },
  {
    id: '2',
    name: 'Dịch vụ và tư vấn',
  },
  {
    id: '3',
    name: 'Nông nghiệp/Lâm nghiệp/Khai khoáng',
  },
  {
    id: '4',
    name: 'Về tài chính/Công nghệ thông tin',
  },
  {
    id: '5',
    name: 'Bán lẻ và phân phối',
  },
  {
    id: '6',
    name: 'Lĩnh vực sản xuất',
  },
  {
    id: '7',
    name: 'Vận tải và logistic',
  },
  {
    id: '8',
    name: 'Thông tin và truyền thông',
  },
  {
    id: '9',
    name: 'Y tế',
  },
  {
    id: '10',
    name: 'Giáo dục',
  },
  {
    id: '11',
    name: 'Môi trường',
  },
]

export const RANK = [
  {
    value: 'created_at',
  },
  {
    value: 'priceDown',
  },
  {
    value: 'priceUp',
  },
  {
    value: 'acreageDown',
  },
  {
    value: 'acreageUp',
  },
]

export const formatPhoneNumber = phoneNumberString => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null
}

export const humanFileSize = size => {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  )
}

export const LOCALES = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
  },
  {
    code: 'en',
    name: 'Tiếng Anh',
  },
  {
    code: 'ja',
    name: 'Tiếng Nhật',
  },
  {
    code: 'ko',
    name: 'Tiếng Hàn',
  },
  {
    code: 'zh',
    name: 'Tiếng Trung',
  },
]
