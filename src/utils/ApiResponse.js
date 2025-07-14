class ApiResponse {
  constructor(status, message = 'Success', data = {}, success = true) {
    this.status = status;
    this.message = message;
    this.success = success;

    // Assign each key-value pair from the `data` object to the instance
    if (data && typeof data === 'object') {
      Object.assign(this, data);
    }
  }
}

export default ApiResponse;
