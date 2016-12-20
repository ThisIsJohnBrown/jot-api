export class Sensor {
  public type: string;
  protected lastRead: number;

  constructor() {

  }

  public setReading(read:number):void {
    this.lastRead = read;
  }

  public getReading():number {
    return this.lastRead;
  }
}

export class TemperatureSensor extends Sensor {
  constructor() {
    super();
    this.type = 'temperature';
  }
}

export class NoiseSensor extends Sensor {
  constructor() {
    super();
    this.type = 'noise';
  }
}