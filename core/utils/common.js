/**
 * clone Object or Array
 * @param {Object | Array} value
 * @returns {Object | Array}
 */
export const JS_deepCopy = value => {
  return JSON.parse(JSON.stringify(value))
}

/**
 * Replace message
 * @param {String} strBase
 * @param {Array<String>} msgArrayReplace
 * @return {String}
 */
export const JS_putMessage = (strBase, msgArrayReplace) => {
  let strNewMsg = strBase
  for (let i = 0; i < msgArrayReplace.length; i++) {
    strNewMsg = strNewMsg.replace('{' + i + '}', msgArrayReplace[i])
  }
  return strNewMsg
}

/**
 * convert price
 * @param {String | Number} value
 * @returns {String}
 */
export const JS_ConvertPrice = (value = '', isTranslate = true) => {
  const price = parseInt(value)
  const divideMillion = price / 1000000
  const divideBillion = price / 1000000000
  if (price && divideBillion >= 1) {
    return {
      num: JS_addComma(JS_numberRound(divideBillion)),
      txt: isTranslate ? 'billion' : ' Tỷ',
    }
  } else if (price && divideMillion >= 1) {
    return {
      num: JS_addComma(JS_numberRound(divideMillion)),
      txt: isTranslate ? 'million' : ' Triệu',
    }
  } else {
    return {
      num: JS_addComma(price),
      txt: '',
    }
  }
}

/**
 * convert acreage
 * @param {Number} value
 * @param {Number} type
 * @returns {Number}
 */
export const JS_ConvertAcreage = (value, type) => {
  const numberData = parseInt(
    typeof value === 'string' ? value.replaceAll(',', '') * 1 : value
  )
  if (type === 'hecta') {
    const multiplyHectares = numberData * 10000
    return multiplyHectares
  }
  return numberData
}

/**
 * convert price
 * @param {String | Number} value
 * @param { String } type
 * @returns {String}
 */
export const JS_ConvertCurrency = (value = '', type) => {
  const price = parseInt(
    typeof value === 'string' ? value.replaceAll(',', '') * 1 : value
  )
  const divideMillion = price * 1000000
  const divideBillion = price * 1000000000
  if (price && type === 'Triệu') {
    return divideMillion
  } else if (price && type === 'Tỷ') {
    return divideBillion
  } else {
    return price
  }
}
/**
 * add comma
 * @param {String | Number} value
 * @returns {String}
 */
export const JS_addComma = (...args) => {
  let i
  let ch
  let sVal = String(args[0])
  let nDecLen = args[1]

  if (sVal == '-') {
    return ''
  }
  sVal = JS_removeComma(sVal.replace(/[ 　]/g, ''))

  if (sVal === '') return ''
  let newString = ''
  let flag = '' // マイナスのとき"-"を格納

  // 小数点7桁以降を削除（7桁を超えると指数表示になる）
  if (sVal.indexOf('.') > -1) sVal = sVal.substr(0, sVal.indexOf('.') + 7)

  let flg = 1
  for (i = sVal.length - 1; i >= 0; i--) {
    ch = sVal.substring(i, i + 1)
    if (ch == '-' && i === 0) {
      // 左端で "-"はマイナス記号
      flag = ch
    } else if (ch >= '0' && ch <= '9') {
      newString = ch + newString
    } else if (flg == 1 && ch == '.') {
      newString = ch + newString
      flg = 0
    } else {
      return 0
    }
  }
  //カンマ区切りにする
  let cnt = 0
  let n = ''
  newString = parseFloat(newString) + ''
  // parseFloatで除去された小数部を付与しなおす
  // → 小数部が「0」の時、parseFloatで小数部が除去されてしまいカンマ付が正しく行えなくなるため
  if (flg == 0 && newString.indexOf('.') == -1)
    newString += sVal.substr(sVal.indexOf('.'))

  for (i = newString.length - 1; i >= 0; i--) {
    ch = newString.substring(i, i + 1)
    if (flg == 1) {
      if (ch >= '0' && ch <= '9') {
        n = newString.charAt(i) + n
        cnt++
        if (cnt % 3 == 0 && i != 0) n = ',' + n
      }
    } else {
      n = newString.charAt(i) + n
    }
    if (newString.charAt(i) == '.') {
      flg = 1
    }
  }
  // 小数部整形
  if (args.length != 1) {
    let j = n.indexOf('.')
    if (nDecLen < 1 && j != -1) {
      // 小数部桁数が「0」以下の場合、小数点以下を切り捨て
      n = n.split('.')[0]
    } else {
      // 小数部がない場合は小数点を付与
      if (j == -1) n += '.'
      // 小数部に引数「小数部桁数」分の「0」を付与
      for (i = 0; i < nDecLen; i++) n += '0'
      // 整数部に小数点と、引数「小数部桁数」分の数値を結合
      if (j != -1) n = n.split('.')[0] + '.' + n.substr(j + 1, nDecLen)
    }
  }
  return flag + n
}

/**
 * remove comma
 * @param {String} value
 * @returns {String}
 */
export const JS_removeComma = targetValue => {
  const value = targetValue?.toString() || ''
  let num = value.split(',')
  let newString = num.join('')

  return newString
}

/**
 * number round
 * @param {String} value
 * @returns {String}
 */
export const JS_numberRound = value => {
  try {
    return Math.round(Number(value) * 100) / 100
  } catch (error) {
    return value
  }
}
/**
 * convert price
 * @param {String | Number} value
 * @param { String } type
 * @returns {String}
 */
export const JS_ConvertHecta = (value, type) => {
  let hectaData = 0
  if (type === 'set_hecta') {
    hectaData = (Number(value) / 0.0001).toString()
  } else {
    hectaData = (Number(value) * 0.0001).toString()
  }
  return hectaData
}

export const JS_RemoveVietnameseTones = str => {
  str = str ? str : ''
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  )
  return str
}
