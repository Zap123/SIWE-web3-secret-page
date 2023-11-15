
export class UserDto {
  constructor(handle: string, address: string) {
    this.handle = handle;
    this.address = address;
  }

  handle: string;
  address: string;
}
