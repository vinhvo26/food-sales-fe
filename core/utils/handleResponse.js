class ApiResponse {
  constructor(response) {
    const { data, error } = response
    this.data = data?.value || {}
    this.checkErr(error?.value?.statusCode)
  }

  checkErr(err) {
    switch (err) {
      case 400:
        throw new Error('Bab request')
      case 401:
        this.data.status = false
        this.data.message = 'Unauthenticated'
        break
      case 404:
        throw new Error('API not found')
      case 500:
        throw new Error('Server error')
      default:
        break
    }
  }
}

export default ApiResponse
