const TypePost = {
  BUY: 1,
  SELL: 2,
  FOR_RENT: 3,
}

const TypePostString = {
  BUY_STRING: 'Tin Mua/Thuê',
  SELL_STRING: 'Tin Bán/Cho Thuê',
  FOR_RENT_STRING: 'Cho thuê',
}

const StatusPost = {
  ACTIVE: 2,
  PENDING: 1,
  REJECT: 3,
}

const POST = {
  ...TypePost,
  ...StatusPost,
  ...TypePostString,
}

export default POST
