export class AureliaLeafletException {
  constructor(message: string) {
    this.message = message;
  }

  public name: string = "AureliaLeafletException";
  public message: string;
}
